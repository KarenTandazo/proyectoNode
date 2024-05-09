'use strict'


let redis = {
    host: 'redis-14497.c11.us-east-1-3.ec2.redns.redis-cloud.com',
    port: 14497, 
    password: 'zFISAMTe1HzQM50FozUJuZkXgLxEXUEs',
}

const {
    primerJob: primerJobWorker
} = require ('./workers')

const Queue = require('bull');

const primerJob = new Queue('primerJob', { redis });

primerJob.process(1, (job, done) => primerJobWorker(job, done));

const queues = [
    {
        name: "primerJob",
        hostId: "Job de test de configuración",
        redis
    }
];

module.exports = {
    primerJob,
    queues
}