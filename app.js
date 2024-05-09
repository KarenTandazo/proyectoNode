'use strict'

const Arena = require('bull-arena');
const Bull = require('bull');
const { queues } = require('./workers/queues')
const express = require('express');
const app = express();
var bodyParser = require('body-parser');

var routes = require('./routes/api');

app.use(bodyParser.urlencoded({
    extended:false
}));

app.use(bodyParser.json({
    parameterLimit: 100000,
    limit: '50mb',
    extended: false
}));

//Errores de Json
app.use((err, req, res, next) => {
    if(err instanceof SyntaxError && err.status === 400 && 'body' in err){
        return res.status(400).send({
            status:400,
            message: err.message
        });
    }
    next();
});

const arenaConfig = Arena(
    {
        Bull,
        queues,
    },
    {
        basePath: '/arena',
        disableListen: true,
    }
);

app.use('', arenaConfig);

app.use('', routes);

module.exports = app;