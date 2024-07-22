const Grupos = require('../models/Grupos');

//Muestra el fromulario para nuevos Meeti
exports.formNuevoMeeti = async (req, res) => {
    const grupos = await Grupos.findAll({where : {usuarioId : req.user.id}});
    res.render('new-meeti',{
        nombrePagina: 'Crear Nueve Meeti',
        grupos
    })
}