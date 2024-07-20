const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

const multer = require('multer');
const shortid = require('shortid');

const configuracionMulter = {
    /* limitando el tamaño de las imagenes */
    limits: {filesize : 100000},
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname+'/../public/uploads/grupos/')
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, next){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            // el formato es válido
            next(null, true)
        }else{
            // El formato no es valido
            next(new Error('Formato no válido*'), false);
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');

/* sube imagen al servidor */
exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error){
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error', 'El Archivo es muy Grande*');
                }else{
                    req.flash('error',error.message);
                }
            }else if(error.hasOwnProperty('message')){
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
            // TODO: manejar errores
        }else{
            next();
        }
    })
}

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

    // leer la imagen
    if(req.file){
        grupo.imagen = req.file.filename;
    }
       
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