const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const csrf= require('csurf');
const cors = require('cors');
const {create}=require('express-handlebars');
const User = require('./models/User');
const MongoStore = require('connect-mongo');
const clientDB = require('./database/db');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config({path:'./.env'});
require('./database/db');

const app = express();
app.use(cors({
    credentials:true,
    origin: process.env.pathHeroku || "*",
    methods: ["GET","POST"]
}))
app.set("trust proxy", 1);
app.use(
    session({
        secret: process.env.SECRET_SESSION,
        resave:false,
        saveUninitialized:false,
        name:"name-Junior",
        store: MongoStore.create({
            clientPromise : clientDB,
            dbName: process.env.DB_NAME
        }),
        cookie: { secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
        })
    );

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done (null,{id:user._id, userName: user.userName}));
passport.deserializeUser(async(user,done)=> {
    const userDB = await User.findById(user.id)
    return done(null,user)

});

const hbs = create({
    extname:".hbs",
    partialsDir:["./views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine",".hbs");
app.set("views","./views");

app.use(express.static(__dirname+'/public'));

app.use(express.urlencoded({extended: true}));

app.use(csrf());
app.use(mongoSanitize());

app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken();
    res.locals.mensajes = req.flash("mensajes");
    next();
})

app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));
app.use('/error',require('./routes/error'));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Servidor funcionando en el puerto: ${PORT}`)
});

