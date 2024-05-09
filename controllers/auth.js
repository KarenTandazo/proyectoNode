'use strict'

require('dotenv').config();
var jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var UsersModel = require('../models/users');
var Sessions = require('../models/accessToken');

var controller = {
    login_user: function(req, res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({status:400, errors: errors.array()});
        }
        
        var data = req.body;

        UsersModel.findOne({email:data.email})
        .then(usuarios => {

            //Comparación de password bcrypt
            bcrypt.compare(data.password, usuarios.password, function(err, result) {
                if(result){
                
                    const payload = {
                        user: usuarios
                    }
    
                    let accessToken = jwt.sign(payload, process.env.KEY, {
                        expiresIn: '1d'
                    });
    
                    let today = new Date().toISOString();
    
                    let updateSession = {
                        user: usuarios.email,
                        key: accessToken,
                        creationDate: today,
                        expirationDate: '1d',
                        active: true
                    }
    
                    Sessions.findOneAndUpdate({user:usuarios.email}, updateSession, {upsert: true, new: true})
                    .then(session => {
                        if(!session){
                            return res.status(401).send({
                                status: 401,
                                message: "Usuario no encontrado (session)",
                            });
                        }
                        return res.status(200).send({
                            status: 200,
                            message: "Inicio de sesión correctamente",
                            token: accessToken
                        });
                    })
                    .catch(error => {
                        console.error(error);
                        return res.status(500).send({
                            status: 500,
                            message: "Error detectado",
                        });
                    });
    
                }else{
                    return res.status(401).send({
                        status: 401,
                        message: "Datos no válidos",
                    });
                }
            }); 
        })
        .catch(error => {
            console.error(error);
            return res.status(401).send({
                status: 401,
                message: "Datos no válidos",
            });
        });
    },

    logout_user: function(req, res){
        const token = req.headers['x-proyectonode-access-token'];

        Sessions.findOneAndDelete({user:req.decoded.user.email, key: token})
        .then(usuarios => {
            if(!usuarios){
                return res.status(401).send({
                    status: 401,
                    message: "Token no encontrada",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Sesión finalizada",
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                status: 500,
                message: "Token inválido",
            });
        });
    }
};

module.exports = controller;