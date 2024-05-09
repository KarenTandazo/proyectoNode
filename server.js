'use strict'

const mongoose = require('mongoose');
require('dotenv').config();
var app = require('./app')
var port = 3200;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOURL)
        .then(() => {
            console.log("Conexión a la base de datos establecida con éxito");
            var server = app.listen(port, () => {
                console.log(`App escuchando en el puerto ${port}`)
              });
            
            server.timeout = 120000;
              
        })
        .catch(error => console.log(error));
        