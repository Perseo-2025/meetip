const express = require('express')
const router = express.Router()

const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const gruposController = require('../controllers/gruposController');
const meetiController = require('../controllers/meetiController');


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
    router.post('/nuevo-grupo', 
        gruposController.subirImagen,
        gruposController.crearGrupo);

    // Editar grupos
    router.get('/editar-grupo/:id', 
        authController.usuarioAuntenticado,
        gruposController.formEditarGrupo
    )
    router.post('/editar-grupo/:id', 
        authController.usuarioAuntenticado,
        gruposController.editarGrupo
    )
    //Editar la imagen del grupo
    router.get('/imagen-grupo/:id',
        authController.usuarioAuntenticado,
        gruposController.formEditarImagen
    );
    router.post('/imagen-grupo/:id',
        authController.usuarioAuntenticado, 
        gruposController.subirImagen,
        gruposController.editarImagen
    )

    //Eliminar grupos
    router.get('/eliminar-grupo/:id',
        authController.usuarioAuntenticado,
        gruposController.formEliminarGrupo
    )
    router.post('/eliminar-grupo/:id',
        authController.usuarioAuntenticado,
        gruposController.eliminarGrupo
    )

    // NUevos Meeti
    router.get('/nuevo-meeti',
        authController.usuarioAuntenticado,
        meetiController.formNuevoMeeti
    )

    return router
}