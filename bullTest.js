'use strict'

const Queue = require('bull');

//Conexion con redit
const myQueue = new Queue('myQueue', {
    redis: {
        host: 'redis-14497.c11.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 14497, 
        password: 'zFISAMTe1HzQM50FozUJuZkXgLxEXUEs',
    }
});

myQueue.process(async (job) => {
    console.log('Procesando tarea con ID '+ job.id);
    await new Promise(resolve => setTimeout(resolve,3000));

    console.log('Tarea completada para el ID '+ job.id);
});

for (let i = 0; i < 5; i++) {
    myQueue.add({
        index: i
    });
}