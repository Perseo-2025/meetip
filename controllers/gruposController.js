const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

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
    console.log('====================================');
    console.log(req.user);
    console.log('====================================');

    // leer la imagen
    if(req.file){
        grupo.imagen = req.file.filename;
    }
       
    try {
        // almacenar en la BD
        await Grupos.create(grupo);
        req.flash('exito', 'El Grupo se ha Creado Correctamente');
        res.redirect('/administracion');               
    } catch (error) {
        // extraer el mensaje de los errores
        const msgError = error.errors.map(e => e.message);
        console.log('====================================');
        console.log(msgError);
        console.log('====================================');
        req.flash('error', msgError);
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

//Muestra el formulario para editar imagen de egrupo
exports.formEditarImagen = async(req, res) => {
    const grupo = await Grupos.findByPk(req.params.id);
    res.render('imagen-grupo',{
        nombrePagina: `Editar Imagen Grupo : ${grupo.nombre}`,
        grupo
    })
}
//Modifica la imagen en la BD y elimina la anterior
exports.editarImagen = async(req, res, next) => {
    const grupo = await Grupos.findOne({where:{id: req.params.id, usuarioId: req.user.id }})
    if(!grupo){
        req.flash('error', 'Operación no válida*');
        req.redirect('/iniciar-sesion');
        return next();
    }
    //verificar que el archivo sea nuevo
    // if(req.file){
    //     console.log(req.file.filename);
    // }
    //revisar que exista un archivo anterior
    // if(grupo.imagen){
    //     console.log(grupo.imagen);
    // }
    // Si hay imagen anterior y nueva, significa que vamos a borrar la anterior
    if(req.file && grupo.imagen){
        const imagenAnteriorPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`; 
        //eliminar archivo con filesistem
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error){
                console.log(error);
            }
            return;
        })
    }
    // Si hay una imagen nueva, la guardamos
    if(req.file){
        grupo.imagen = req.file.filename;
    }
    //guardar en la BD
    await grupo.save();
    req.flash('exito', 'Cambios almacenados Correctamente');
    res.redirect('/administracion');
}

exports.formEliminarGrupo = async(req, res, next) => {
    const grupo = await Grupos.findOne({where:{id:req.params.id, usuarioId:req.user.id}})
    if(!grupo){
        req.flash('error','Operación no válida');
        res.redirect('/administracion');
        return next();
    }
    // todo bien, ejecutando la vista
    res.render('eliminar-grupo',{
        nombrePagina: `Eliminar Grupo : ${grupo.nombre}`
    })
}
exports.eliminarGrupo = async (req, res, next) => {
    const grupo = await Grupos.findOne({where:{id:req.params.id, usuarioId:req.user.id}})
    if(!grupo){
        req.flash('error','Operación no válida');
        res.redirect('/administracion');
        return next();
    }
    //si hay una imagen eliminarlar
    if(grupo.imagen){
        const imagenAnteriorPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`; 

        fs.unlink(imagenAnteriorPath, (error) => {
            if(error){
                console.log(error);
            }
            return;
        })
    }
    // Eliminar el grupo
    await Grupos.destroy({
        where: {
            id: req.params.id
        }
    });
    // Redirect al usuario
    req.flash('exito', 'Grupo Eliminado');
    res.redirect('/administracion');
}