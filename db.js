const mongoose = require('mongoose');
const schema = mongoose.Schema;

function connectDb(){
    mongoose.connect('mongodb+srv://tript:tript@optimus.jprmvx3.mongodb.net/test').then(()=>{
        console.log("connected to db");
    }).catch((e)=>{
        console.log("an error occured");
        console.log(e);
    });
}

module.exports = connectDb;