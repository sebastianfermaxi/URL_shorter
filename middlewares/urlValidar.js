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
        }
        throw new Error("No válida 😪");
    } catch (error) {
        console.log(error);
        const mensaje = 'url no válida'
        res.render("error",{mensaje});
    }
};

module.exports = validarURL;