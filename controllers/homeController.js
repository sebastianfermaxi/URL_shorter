const Url = require('../models/Url');
const { nanoid } = require('nanoid');

const leerUrl = async(req, res) => {
    try {
     const urls = await Url.find().lean();
    res.render("home", { urls: urls })   
    } catch (error) {
        console.log(error);
        res.send('Algo falló');
    }
    
};

const agregarUrl = async (req,res) => {

    const {origin} = req.body;
    try {
        const url = new Url({origin:origin, shortURL:nanoid(7)});
        await url.save();
        res.redirect('./');
    } catch (error) {
        const mensaje = 'url ya cargada';
        res.render("error", {mensaje});
    }
};

const eliminarUrl = async (req,res) =>{
    const {id} = req.params;
    try {
        await Url.findByIdAndDelete(id);
        res.redirect('/')
    } catch (error) {
        console.log(error);
        res.send('error');
    }
    
};


const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    try {
        const urlDB = await Url.findById(id).lean();
        res.render("home", { urlDB });
    } catch (error) {
        console.log(error);
    }
};

const editarUrl = async (req, res) => {
    const { id } = req.params;
    const { originURL } = req.body;
    try {
        const url = await Url.findById(id);
        if (!url) {
            console.log("no existe");
            return res.send("error no existe el documento a editar");
        }

        await Url.findByIdAndUpdate(id, { origin: originURL });

        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};

const redireccionamiento = async (req,res)=>{

    const {shortURL} = req.params;

    try {
        const urlDB = await Url.findOne({shortURL:shortURL})
        res.redirect(urlDB.origin)
    } catch (error) {
        console.log(error)
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