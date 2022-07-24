const express= require('express');
const {leerUrl,agregarUrl, eliminarUrl, editarUrl, editarUrlForm, redireccionamiento} = require('../controllers/homeController');
const { formPerfil, editarFotoPerfil } = require('../controllers/perfilController');
const urlValidar = require('../middlewares/urlValidar');
const verificarUser = require('../middlewares/verificarUser');
const router = express.Router();

router.get('/',verificarUser, leerUrl );
router.post('/',verificarUser, urlValidar, agregarUrl);
router.get('/eliminar/:id',verificarUser,eliminarUrl);
router.get('/editar/:id', verificarUser, editarUrlForm);
router.post('/editar/:id', verificarUser, urlValidar,editarUrl);
router.get('/perfil',verificarUser, formPerfil);
router.post('/perfil',verificarUser, editarFotoPerfil);
router.get('/:shortURL', redireccionamiento)

module.exports = router;