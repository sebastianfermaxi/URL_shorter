const mongoose = require("mongoose");
require('dotenv').config();

const clientDB = mongoose
    .connect(process.env.URI)
    .then( (e)=> {
        console.log("Db conectada 😼")
        return e.connection.getClient();
    })
    .catch( e => console.log("La conexión falló" + e))

module.exports= clientDB