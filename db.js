const mongoose = require('mongoose');
const schema = mongoose.Schema;


function connectDb(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("connected to db");
        // console.log(process.env.MONGO_URI)
    }).catch((e)=>{
        console.log("an error occured");
        console.log(e);
    });
}

module.exports = connectDb;