const { URL } = require("url");

const validarURL = (req, res, next) => {
    try {
        const { origin } = req.body;
        const urlFrontend = new URL(origin);
        if (urlFrontend.origin !== "null") {
            if (
                urlFrontend.protocol === "http:" ||
                urlFrontend.protocol === "https:"
            ) {
                return next();
            }
            throw new Error("URL no válida");
        }
        
    } catch (error) {
        req.flash("mensajes",[{msg:"URL no válida"}])
        res.redirect('/');
    }
};

module.exports = validarURL;