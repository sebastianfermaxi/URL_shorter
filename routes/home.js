const express= require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const urls = [
        {
            origin: "www.google.com/bluweb1",
            shortURL: "jasjfd1"
        },

        {
            origin: "www.google.com/bluweb2",
            shortURL: "jasjfd2"
        },

        {
            origin: "www.google.com/bluweb3",
            shortURL: "jasjfd3"
        },
    ]
    res.render("home", { urls: urls })
});

module.exports = router;