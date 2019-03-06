const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env.DB_STRING, {useCreateIndex: true, useNewUrlParser: true } );
    mongoose.connection.on('open', ()=> {
        console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err)=> {
        console.log('MongoDB: Has a error',err);
    });
    mongoose.Promise = global.Promise;
    
}