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
//Editar
exports.formEditarGrupo = async (req, res, next) => {
    const consultas = [];
    consultas.push(Grupos.findByPk(req.params.id));
    consultas.push(Categorias.findAll());

    // Promise
    const [grupo, categorias] = await Promise.all(consultas);

    res.render('editar-grupo',{
        nombrePagina:` Editar Grupo ${grupo.nombre}`,
        grupo,
        categorias
    })
}

//guarda los cambios en la BD
exports.editarGrupo = async (req, res, next) => {
    const grupo = await Grupos.findOne({where:{id: req.params.id, usuarioId: req.user.id }})
   
    if(!grupo){
        req.flash('error','Operación no válida');
        res.redirect('/administracion');
        return next();
    }
    const { nombre, descripcion, categoriaId, url } = req.body;
    // asignar los valores
    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoriaId = categoriaId;
    grupo.url = url;

    //save db
    await grupo.save();
    req.flash('exito', 'Cambios Almacenados Correctamente');
    res.redirect('/administracion');
}
