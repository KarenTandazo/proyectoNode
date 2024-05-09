'use strict'

module.exports = async (job, done) => {
    try{
        job.progress(99);

        console.log("Hola mundo desde el job");

        return done(null,{"message":"Job ejecutado correctamente"})
    }catch(error){
        return done(error);
    }
}