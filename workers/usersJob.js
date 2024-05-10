'use strict'

const bcrypt = require('bcrypt');
var UsersModel = require('../models/users');

module.exports = async (job, done) => {
    try{
        let data = job.data;

        UsersModel.findOne({iduser:data.iduser})
        .then(usuarios => {

            if(usuarios){
                return done(new Error('Usuario existente'));
            }
            
            //Crypt de password
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(data.password, salt, function(err, hash) {
                    var createUser = new UsersModel();
                    createUser.iduser = data.iduser;
                    createUser.nombre = data.nombre;
                    createUser.edad = data.edad;
                    createUser.email = data.email;
                    createUser.password = hash;

                    createUser.save()
                    .then(resultado => {
                        var respuestaEspecifica = {
                            "iduser": resultado.iduser,
                            "nombre": resultado.nombre,
                            "edad": resultado.edad,
                            "email": resultado.email,
                            "password": resultado.password
                        }
                        job.progress(100);
                        return done(null,resultado);
                    })
                    .catch(error => {
                        return done(error);
                    });
                });
            });
        
        })
        .catch(error => {
            return done(error);
        });

    }catch(error){
        return done(error);
    }
}