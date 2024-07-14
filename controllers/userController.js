const Usuarios = require('../models/Usuarios');
const sendEmail = require('../handlers/emails');

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

        // Generar url de confirmacion
        const url = `http://${req.headers.host}/confirmar-cuenta/${user.email}`;

        // Eniar email de confirmación 
        await sendEmail.enviarEmail({
            user,
            url,
            subject: 'Confirmar tu cuenta de Meeti',
            file: 'confirmar-cuenta', //nombre del archivo

        })

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

/* Confirmar Cuenta */
exports.confirmarCuenta = async (req, res, next) => {
    // verificar que el usuario existe
    const user = await Usuarios.findOne({where : {email: req.params.correo }})
    // console.log(req.params.correo);
    // console.log(user);
    // sino existe, redireccionar
    if(!user){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/crear-cuenta');
        return next();
    }

    // si existe, confirmar suscripción y redireccionar
    user.activo = 1; // reescribiendo la propiedad
    await user.save();

    req.flash('exito', 'La cuenta se ha confirmado correctamente, ya puedes iniciar sesión')
    res.redirect('/iniciar-sesion');
}


// Formulario para iniciar sesion
exports.formLogin = (req, res) => { //nombre de la ruta
    res.render('iniciar-sesion', {//nombre del archivo
        nombrePagina: 'Iniciar Sesión'
    }) 
}