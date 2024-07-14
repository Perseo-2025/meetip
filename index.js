/* Creamos nuestro servidor  */
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const boydParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('./config/passport');
const router = require('./routes');

/* Conectando a la bd */
const db = require('./config/db');
require('./models/Usuarios');
db.sync().then(() => console.log('DB conectado correctamente')).catch((error) => { console.log("HAY UN ERROR :",error)})

/* Variables de desarrollo */
require('dotenv').config({path: 'variables.env'});

/* Aplicación principal */
const app = express();

/* Body parser, leer el formulario */
app.use(boydParser.json());
app.use(boydParser.urlencoded({extended: true}));

/* Express validator (validacion con bastantes funciones) */
app.use(expressValidator())


// Habilitar EJS como template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

/* Ubicacon vistas */
const ruta = path.join(__dirname,'./views');
app.set('views', ruta);

/* Archivos staticos */
app.use(express.static('public'));

/* Habilitar cookie parser */
app.use(cookieParser());

/* Crear la sesión */
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}));

/* Inicializar passport */
app.use(passport.initialize());
app.use(passport.session());

// Agrega  flash messages
app.use(flash());

//Middleware (usuario logeado, flash messages)
app.use((req, res, next)=> {
    res.locals.msg = req.flash();
    const fecha = new Date()
    res.locals.year = fecha.getFullYear();
    next();
});


//Routing
app.use('/', router());

//Agrega el puerto
app.listen(process.env.PORT, () => {
    console.log('El servidor esta funcionando');
});
