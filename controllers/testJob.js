'use strict'

const { primerJob } = require('../workers/queues')

var controller = {
    primerJob: function (req, res){
        let numeros = req.body;

        primerJob.add(numeros);

        return res.status(200).send({
            status: 200,
            message: "El job fue recibido",
        });
    }
}

module.exports = controller;