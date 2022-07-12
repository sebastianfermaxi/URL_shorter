const express= require('express');
const {leerUrl,agregarUrl, eliminarUrl, editarUrl, editarUrlForm, redireccionamiento} = require('../controllers/homeController');
const urlValidar = require('../middlewares/urlValidar');
const router = express.Router();

router.get('/', leerUrl );
router.post('/', urlValidar, agregarUrl);
router.get('/eliminar/:id',eliminarUrl);
router.get('/editar/:id', editarUrlForm);
router.post('/editar/:id',urlValidar,editarUrl);
router.get('/:shortURL', redireccionamiento)

module.exports = router;