const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

exports.formNuevoGrupo = async(req, res) => {
    const categorias = await Categorias.findAll()
    res.render('nuevo-grupo', { //name file
        nombrePagina: 'Crea un nuevo grupo',
        categorias
    })
}

exports.crearGrupo = async (req, res) => {
    //sanitizar 
    req.sanitizeBody('nombre');
    req.sanitizeBody('url');

    const grupo = req.body;

    // almacena el usaurio autentucado como el creador del grupo
    grupo.usuarioId = req.user.id;
       
    try {
        // almacenar en la BD
        await Grupos.create(grupo);
        req.flash('exito', 'Se ha creado el Grupo Correctamente');
        res.redirect('/administracion');               
    } catch (error) {
        // extraer el mensaje de los errores
        const msgError = error.errors.map(e => e.message);
        req.flash('error',msgError);
        res.redirect('/nuevo-grupo');
    }
}