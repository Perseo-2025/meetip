const Sequelize = require('sequelize')

module.exports = new Sequelize('meeti', 'root', '', {
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    //define: {
    //    timestamps: false
    //},
    logging:false /* para ocultar todo el texto que genera en la terminal */
})

