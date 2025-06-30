const { required } = require('joi')
const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
});
userSchema.plugin(passportLocalMongoose); // this plugin will add a username,hashed password and the salt value automatically in db as field
const User=mongoose.model("User",userSchema)
module.exports=User;