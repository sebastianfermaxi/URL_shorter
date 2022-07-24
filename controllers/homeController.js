const Url = require('../models/Url');
const { nanoid } = require('nanoid');

const leerUrl = async(req, res) => {
    //console.log(req.user.userName)
    try {
     const urls = await Url.find({user:req.user.id}).lean();
    res.render("home", { urls: urls, user:req.user.userName })   
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect('/');
    }
    
};

const agregarUrl = async (req,res) => {

    const {origin} = req.body;
    try {
        const url = new Url({origin, shortURL:nanoid(7), user : req.user.id});
        await url.save();
        req.flash("mensajes", [{ msg: "URL agregada" }])
        res.redirect('/');
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }])
        res.redirect('/');
    }
};

const eliminarUrl = async (req,res) =>{
    const {id} = req.params;
    try {
        const url = await Url.findById(id);
        if(!url.user.equals(req.user.id)){
            throw new Error("No es tu URL")
        }
        await url.remove();
        req.flash("mensajes", [{ msg:"URL Eliminada"}]);
        res.redirect('/')
    } catch (error) {
        req.flash("mensajes", [{ msg:error.message }]);
        return res.redirect('/');
    }
    
};


const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    try {
        const urlDB = await Url.findById(id).lean();
        if (!urlDB.user.equals(req.user.id)) {
            throw new Error("No es tu URL")
        }
        res.render("home", { urlDB });
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect('/');
    }
};

const editarUrl = async (req, res) => {
    const { id } = req.params;
    const { origin } = req.body;
    try {
        const url = await Url.findById(id);
        if (!url.user.equals(req.user.id)) {
            throw new Error("No es tu URL")
        }
        if (!url) {
            req.flash("mensajes", [{ msg: "No hay nada para editar" }]);
            return res.redirect('/');
        }

        await Url.findByIdAndUpdate(id, { origin: origin });
        req.flash("mensajes", [{ msg: "URL Editada" }]);
        

        res.redirect("/");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect('/');
    }
};

const redireccionamiento = async (req,res)=>{

    const {shortURL} = req.params;
    //console.log(req.params)
    try {
        const urlDB = await Url.findOne({shortURL});
        //console.log(urlDB.origin)
        if (!urlDB.origin) {
            req.flash("mensajes", [{ msg: error.message }]);
            return res.redirect('/');
        }
        res.redirect(urlDB.origin);
        
    } catch (error) {
        return res.redirect('/');
    }
};

module.exports = {
    leerUrl,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionamiento
};