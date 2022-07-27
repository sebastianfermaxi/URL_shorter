const User = require('../models/User.js');
const {nanoid} = require ('nanoid');
const {validationResult} = require ('express-validator');
const nodemailer = require ('nodemailer');
require('dotenv').config();

const registerForm = (req,res) =>{
    res.render('register')

};
const registerUser = async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        req.flash("mensajes", errors.array());
        return res.redirect('/auth/register');
    }

    const{userName, email, password} = req.body;

    try {
        let user = await User.findOne({email:email});
        if(user)throw new Error('email ya registrado');
        user = new User({userName, email, password,token:nanoid()});
        
        await user.save();
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.userEmail,
                pass: process.env.passEmail
            }
        });
        await transport.sendMail({
            from: 'Acortador de URL',
            to: user.email,
            subject: "Verifique cuenta de correo de Acortador de URLs",
            html: `<a href="${process.env.pathHeroku || "http://localhost:5000"}/auth/confirmar/${user.token}">Verificar cuenta aquí</a>`,
        });
     
        req.flash("mensajes", [{ msg: "Revisa tu email y confirma tu cuenta" }]);
        res.redirect('/auth/login')
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect('/auth/login');
    }

};
const confirmarCuenta = async(req,res)=>{
    const {token} = req.params;
   try {
    const user = await User.findOne({token})
    //console.log(token)
    if(!user) throw new Error('error no existe este usuario');
    user.cuentaConfirmada= true;
    user.token= null;
    await user.save()
       req.flash("mensajes", [{ msg: "Cuenta verificada, puedes iniciar sesión" }]);
   res.redirect('/auth/login')
    
   } catch (error) {
       req.flash("mensajes", [{ msg: error.message }]);
       return res.redirect('/auth/login');
   }
}

const loginForm = (req,res)=>{

    res.render('login');

}

const loginUsuario = async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array());
        return res.redirect('/auth/login');
    }
    const {email, password} = req.body;
    

    try {
        const user = await User.findOne({email});
        if(!user) throw new Error('Email no registrado');
        if(!user.cuentaConfirmada) throw new Error('Cuenta no confirmada');
        const coincide = await user.comparePassword(password);
        
        if(!coincide) throw new Error('Contraseña incorrecta')
        
        req.login(user, function(err){
            if(err) throw new Error('Error al iniciar sesión');
            return res.redirect('/')
        })
        
       
    } catch (error) {
        req.flash("mensajes", [{ msg : error.message}]);
        return res.redirect('/auth/login');
    }
};

const cerrarSesion = (req,res) =>{
    req.logout(()=>{
       return res.redirect('/auth/login') 
    });
    
}
module.exports ={
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUsuario,
    cerrarSesion
}