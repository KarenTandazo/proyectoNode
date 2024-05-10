'use strict'

const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

var UsersModel = require('../models/users');
const { usersJob } = require('../workers/queues')

var controller = {
    userList: function(req, res){
        UsersModel.find()
        .then(usuarios => {
            return res.status(200).send({
                status: 200,
                message: "Listado de usuarios",
                data: usuarios
            })
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                status: 500,
                message: "Error detectado",
            })
        });
    },
    
    userSingular: function(req, res){
        var params = req.params;
        var iduser = params.iduser;

        UsersModel.findOne({iduser:parseInt(iduser)})
        .then(usuarios => {
            if(!usuarios){
                return res.status(404).send({
                    status: 404,
                    message: "Usuario no encontrado",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Información de usuario",
                data: usuarios
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                status: 500,
                message: "Error detectado",
            });
        });
    },
    
    createUser: function(req, res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({status:400, errors: errors.array()});
        }

        var data = req.body;

        usersJob.add(data);

        return res.status(200).send({
            status: 200,
            message: "Usuario recibido"
        });
    },

    updateUser: function(req, res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({status:400, errors: errors.array()});
        }

        var params = req.params;
        var iduser = params.iduser;

        var data = req.body;

        //Crypt de password
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(data.password, salt, function(err, hash) {
                var updateUser = {
                    iduser: data.iduser,
                    nombre: data.nombre,
                    edad: data.edad,
                    email: data.email,
                    password: hash
                }
                UsersModel.findOneAndUpdate({iduser:parseInt(iduser)}, updateUser)
                .then(usuarios => {
                    if(!usuarios){
                        return res.status(200).send({
                            status: 200,
                            message: "Usuario no encontrado",
                        });
                    }
                    return res.status(200).send({
                        status: 200,
                        message: "Usuario actualizado",
                    });
                })
                .catch(error => {
                    console.error(error);
                    return res.status(500).send({
                        status: 500,
                        message: "Error detectado",
                    });
                });
            })
        })
    },

    deleteUser: function(req, res){
        var params = req.params;
        var iduser = params.iduser;

        UsersModel.findOneAndDelete({iduser:parseInt(iduser)})
        .then(usuarios => {
            if(!usuarios){
                return res.status(200).send({
                    status: 200,
                    message: "Usuario no encontrado",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Usuario eliminado",
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                status: 500,
                message: "Error detectado",
            });
        });
    },
};

module.exports = controller;