const Usuarios = require('../models/Usuarios')

exports.formCrearCuenta = (req, res) => { //nombre de la ruta
    res.render('crear-cuenta', {//nombre del archivo
        nombrePagina: 'Crea tu Cuenta'
    }) //nombre del archivp
}
exports.createNewUser = async (req, res) => {
    const user = req.body
    try {
        const newUser = await Usuarios.create(user)

        // TODO: flash Message y redireccionar

        console.log('Usuario creado: ',newUser);
    } catch (error) {
        console.log(error);
    }

    
}