const mongoose = require("mongoose");
const { type, min, max } = require("../schema");
const { date } = require("joi");
const User = require("./user");

let reviewsSchema = new mongoose.Schema({
    comment:{
        type:String
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})
const review= mongoose.model("review",reviewsSchema)
module.exports=review