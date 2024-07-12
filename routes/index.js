const express = require('express')
const router = express.Router()

const homeController = require('../controllers/homeController')
const userController = require('../controllers/userController')
module.exports = function(){
    /* Se define el nombre de la ruta localhost5000:inicio localhost:5000/crear-cuenta */
    router.get('/', homeController.home)
    
    router.get('/crear-cuenta', userController.formCrearCuenta)
    router.post('/crear-cuenta', userController.createNewUser)
    
    return router
}