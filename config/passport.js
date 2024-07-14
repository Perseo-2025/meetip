const passport = require('passport');
const LocalStrategy = require('passport-local');
const Usuarios = require('../models/Usuarios');
const { where } = require('sequelize');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    },
    async (email, password, next) => {
        // al llenar el formulario
        const user = await Usuarios.findOne({
            where: {email, activo:1}
        });

        // revisar si no existe o no
        if(!user) return next(null, false, {
            message: 'Ese usuario no existe o No confirmaste tu cuenta'
        });
        //El usuario existe, comparar su password
        const verificarPassword = user.validarPassword(password);
        // si el password es incorrecto 
        if(!verificarPassword) return next(null, false,{
            message: 'Password Incorrecto'
        });

        // Todo bien
        return next(null, user)

    }

));

passport.serializeUser(function(usuario, cb){
    cb(null, usuario);
});
passport.deserializeUser(function(usuario, cb){
    cb(null, usuario);
});

module.exports = passport;