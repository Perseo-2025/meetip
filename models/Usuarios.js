const Sequelize = require('sequelize')
const db = require('../config/db')
const bcrytp = require('bcrypt-nodejs')

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
        
    },
    nombre : Sequelize.STRING(60),
    imagen : Sequelize.STRING(60),
    email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            isEmail: { msg: 'Agregar un correo válido'}
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    } ,
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty:{
                msg: 'El password no puede ir vacío'
            }
        }
    },
    activo:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    token:Sequelize.STRING,
    expiraToken: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(user) {
            user.password = bcrytp.hashSync(user.password, bcrytp.genSaltSync(10), null)
        },
    }
})

// MÉTODO PARA COMPARA LOS PASSWORD
Usuarios.prototype.validarPassword = function(password){
    return bcrytp.compareSync(password, this.password)
}
module.exports = Usuarios;