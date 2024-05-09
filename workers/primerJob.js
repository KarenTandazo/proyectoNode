'use strict'

module.exports = async (job, done) => {
    try{

        job.progress(0);

        let numeros =  job.data

        console.log(numeros);

        setTimeout(() => {
            console.log("Han pasado 20 seg");
            job.progress(100);
            numeros.message = "Job ejecutado correctamente";
            return done(null,numeros);
        }, 10000);

    }catch(error){
        return done(error);
    }
}