'use strict'

const express = require('express');
const expressRedisCache = require('express-redis-cache');
const { body } = require('express-validator');
var api = express.Router();
var middleware = require("../middleware/middleware");
var UsersController = require('../controllers/users');
var AuthController = require('../controllers/auth');
var TestCacheController = require('../controllers/cache');
var TestJobController = require('../controllers/testJob');

//Conexion con redit
const cache = expressRedisCache({
    host: 'redis-14497.c11.us-east-1-3.ec2.redns.redis-cloud.com',
    port: 14497, 
    auth_pass: 'zFISAMTe1HzQM50FozUJuZkXgLxEXUEs',
    expire: 1200
})

//Login
api.post('/login',[
    body("email").not().isEmpty(),
    body("password").not().isEmpty(),
], AuthController.login_user); 

//Logout
api.post('/logout', middleware.userProtectUrl, AuthController.logout_user);

//CRUD - USUARIOS
api.post('/user', middleware.userProtectUrl, [
    body("iduser").not().isEmpty(),
    body("nombre").not().isEmpty(),
    body("edad").not().isEmpty(),
    body("email").not().isEmpty(),
    body("password").not().isEmpty()
], UsersController.createUser);
api.get('/user', middleware.userProtectUrl, UsersController.userList);
api.get('/user/:iduser', middleware.userProtectUrl, UsersController.userSingular);
api.put('/user/:iduser', middleware.userProtectUrl, [
    body("iduser").not().isEmpty(),
    body("nombre").not().isEmpty(),
    body("edad").not().isEmpty(),
    body("email").not().isEmpty(),
    body("password").not().isEmpty()
], UsersController.updateUser);
api.delete('/user/:iduser', middleware.userProtectUrl, UsersController.deleteUser);

//Test Cache
api.get('/testcache',cache.route(), TestCacheController.testcache);

//Test Jobs
api.get('/primerJob',TestJobController.primerJob);

module.exports = api; 