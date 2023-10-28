const mongoose = require('mongoose');
const schema = mongoose.Schema;

function connectDb(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("connected to db");
    }).catch((e)=>{
        console.log("an error occured");
        console.log(e);
    });
}

module.exports = connectDb;