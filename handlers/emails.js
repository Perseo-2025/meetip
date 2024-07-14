const nodemailer = require('nodemailer');
const emailConfig = require('../config/emails');
const fs =require('fs');
const util = require('util');
const ejs = require('ejs');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

exports.enviarEmail = async (options) => {
  
    //leer el archivo para el mail
    const file = __dirname + `/../views/emails/${options.file}.ejs`;

    // compilarlo
    const compile = ejs.compile(fs.readFileSync(file, 'utf8'));

    //crear el html
    const html = compile({ url : options.url });

    //configurar las opciones del email
    const optionsEmail = {
        from : 'Meeti <noreply@meeti.com>',
        to : options.user.email,
        subject: options.subject,
        html
    }

    // enviar el email
    const sendEmail = util.promisify(transport.sendMail, transport);
    return sendEmail.call(transport, optionsEmail);
}