const express = require('express');
const { loginForm, registerForm,registerUser,confirmarCuenta,loginUsuario, cerrarSesion } = require('../controllers/authController');
const router = express.Router();
const {body} = require('express-validator')

router.get('/register', registerForm);
router.post('/register',[
    body("userName", "Ingrese un nombre válido").trim().notEmpty().escape() ,
    body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("password", "Ingrese contraseña de mínimo 6 carácteres").trim().isLength({min:6}).escape()
    .custom((value,{req})=>{
        if(value !== req.body.repassword){
            throw new Error('Las contraseñas no coinciden')
        }else{
            return value;
        }
    })
] 
,registerUser);
router.get('/confirmar/:token', confirmarCuenta)
router.get('/login',loginForm);
router.post('/login',[
    body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("password", "Ingrese contraseña de mínimo 6 carácteres").trim().isLength({ min: 6 }).escape()
] ,loginUsuario);
router.get('/logout', cerrarSesion)
module.exports = router;