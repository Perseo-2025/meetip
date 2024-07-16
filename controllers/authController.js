const passport = require('passport');
//validacion
exports.auntenticarUsuario = passport.authenticate('local',{
    successRedirect : '/administracion',
    failureRedirect : '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

//Revisa si el usuario esta autenticado o no
exports.usuarioAuntenticado = (req, res, next) => {
    // si el usuario esta autenticado, adelante
    if(req.isAuthenticated() ) {
        return next();
    }

    //si no esta autenticado
    return res.redirect('/iniciar-sesion');
}