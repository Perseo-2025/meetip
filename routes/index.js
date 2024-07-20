const express = require('express')
const router = express.Router()

const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const gruposController = require('../controllers/gruposController');

module.exports = function(){
    /* Se define el nombre de la ruta localhost5000:inicio localhost:5000/crear-cuenta */
    router.get('/', homeController.home);
    
    /* Crear y confirmar Cuenta */
    router.get('/crear-cuenta', userController.formCrearCuenta);
    router.post('/crear-cuenta', userController.createNewUser);
    router.get('/confirmar-cuenta/:correo', userController.confirmarCuenta);

    // Iniciar Sesión 
    router.get('/iniciar-sesion', userController.formLogin);
    router.post('/iniciar-sesion', authController.auntenticarUsuario);
    

    /* Panel de administración */
    router.get('/administracion', 
        authController.usuarioAuntenticado,
        adminController.panelAdministracion
    );

    /* Nuevos grupos */
    router.get('/nuevo-grupo', 
        authController.usuarioAuntenticado,
        gruposController.formNuevoGrupo
    );
    router.post('/nuevo-grupo', gruposController.crearGrupo)


    return router
}