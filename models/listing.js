const mongoose = require("mongoose");
const review = require("./reviews")
const user = require("./user")
const listingSchema = new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },  
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"review"
        },
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User" // here, have to include the name of the model itself not the file imported.
    }
})


// to delete all the reviews once the listing is deleted
listingSchema.post("findOneAndDelete",async(listing)=>{    // handling deletion using maongoose middleware
    if(listing){
        await review.deleteMany({_id: {$in:listing.reviews}})
    }
});

const listing = mongoose.model("listing",listingSchema);

module.exports=listing;