exports.home = (req, res) => { //nombre de la ruta
    res.render('home', {//nombre del archivo
        nombrePagina: 'Inicio'
    }) 
}