'use strict'

const { primerJob } = require('../workers/queues')

var controller = {
    primerJob: function (req, res){
        primerJob.add();
        return res.status(200).send({
            status: 200,
            message: "El job fue recibido",
        });
    }
}

module.exports = controller;