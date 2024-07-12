const Usuarios = require('../models/Usuarios')

exports.formCrearCuenta = (req, res) => { //nombre de la ruta
    res.render('crear-cuenta', {//nombre del archivo
        nombrePagina: 'Crea tu Cuenta'
    }) 
}

// Crear cuenta y validar los datos
exports.createNewUser = async (req, res) => {
    const user = req.body;

    req.checkBody('confirmar', 'El password confirmado no puede ir vacio').notEmpty();
    req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);
    
    //Leer los errores de exprees
    const erroresExpress = req.validationErrors();
    

    try {
        await Usuarios.create(user);

        // TODO: flash Message y redireccionar
        req.flash('exito', 'Hemos enviado un Email, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        // extraer el mensaje de los errores
        const msgError = error.errors.map(e => e.message);
        /* Extraer unicamente el msg de los errores */
        const errExpre = erroresExpress.map(e => e.msg);
        //unirlos
        const listaErrores = [...msgError, ...errExpre];

        req.flash('error', listaErrores);
        res.redirect('/crear-cuenta');  
    }
    
}

// Formulario para iniciar sesion
exports.formLogin = (req, res) => { //nombre de la ruta
    res.render('iniciar-sesion', {//nombre del archivo
        nombrePagina: 'Iniciar Sesión'
    }) 
}