var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var mailer = nodemailer.createTransport({
    service: '--',
    auth: {
        // user: 'cbdevtests@mail.ee',
        // pass: 'password00'
        user: 'example@test.com',
        pass: 'password'
    }
});
//Set settings for templates:
mailer.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        layoutsDir: 'server/email/',
        defaultLayout : 'template',
        partialsDir : 'server/email/partials/'
    },
    viewPath: 'server/email/',
    extName: '.hbs'
}))

module.exports = mailer