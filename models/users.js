'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    iduser: Number,
    nombre: String,
    edad: Number,
    email: String,
    password: String
});

module.exports = mongoose.model('usuarios', UserSchema);