const formidable = require('formidable');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

const tamañoMaximo = 50 * 1024 * 1024;

module.exports.formPerfil = async(req,res)=>{

    try {
        const user = await User.findById(req.user.id);

        res.render('perfil', {user:user.userName, imagen:user.imagen})

    } catch (error) {
        req.flash("mensajes", {msg:"Error al caragr el usuario"});
        res.redirect('/perfil')
    }

}
module.exports.editarFotoPerfil = async (req, res) => {

    const form = new formidable.IncomingForm();
    form.maxFileSize = tamañoMaximo;
    form.parse(req, async(err,fields,files) =>{
        try {
            if(err){
                throw new Error('Falló formidable')
            }
            console.log(files.myFile)
            const file = files.myFile;
            if(file.originalFilename === ''){
                throw new Error("Por favor selecciona una imagen")
            }
            
            const imageTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif",
            ];

            if (!imageTypes.includes(file.mimetype)) {
                throw new Error("Por favor selecciona una imagen .jpg o .png");
            }
            
            if(file.size > tamañoMaximo){
                throw new Error("Por favor selecciona una imagen de menos de 5 MB")
            }
            const extension = file.mimetype.split('/')[1];
            const dirFile = path.join(__dirname,`../public/img/perfiles/${req.user.id}.${extension}`)
            fs.renameSync(file.filepath,dirFile);

            const image = await Jimp.read(dirFile);
            image.resize(200,200).quality(70).writeAsync(dirFile);
            const user = await User.findById(req.user.id);
            user.imagen = `${req.user.id}.${extension}`;
            await user.save();


            req.flash("mensajes", { msg:"Ya se subió la imagen" });
            return res.redirect('/perfil')
        } catch (error) {
            
            req.flash("mensajes",{msg:error.message})
            res.redirect('/perfil')
        }
        
    })

}