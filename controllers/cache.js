'use strict'

var controller = {
    testcache: function(req, res){

        let cubos = [];

        function calculoCubo(numero) {
            return numero * numero * numero;
        }
        
        for (let i = 1; i <= 100; i++) {
            const resultado = calculoCubo(i);
            console.log("El cubo de "+ i + " es:", resultado);
            cubos.push("El cubo de "+ i + " es:", resultado)
        }
        
        return res.status(200).send({
            status: 200,
            message: "Test de cache",
            data: cubos
        })
    },
};

module.exports = controller;