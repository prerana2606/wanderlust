const listing = require("./models/listing.js");
const express = require("express");
const review =require("./models/reviews.js")
const {listingSchema}= require("./schema.js") //joi schema
const {commentSchema} = require("./schema.js") // joi schema
const expressError = require("./utils/expressError.js");
module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req)
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req._parsedOriginalUrl.pathname
        req.flash("errorMsg","Required to login")
        return res.redirect('/login')
    }
    next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{ // to redirect to the same url
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.authorizeUser =async(req,res,next)=>{
    let {id}=req.params;
    let list = await listing.findById(id);
    console.log(res.locals.currentUser)
    if (!(res.locals.currentUser && res.locals.currentUser._id.equals(list.owner._id))){
        req.flash("errorMsg","Only authorized user can do")
        return res.redirect(`/listings/${id}`)
    }
    next() // if same user then further code needs to be run 
}
module.exports.authorizeReviewUser=async(req,res,next)=>{
    let {review_id,id}=req.params;
    let reviewList = await review.findById(review_id);
    console.log(reviewList)
    if (!(res.locals.currentUser && res.locals.currentUser._id.equals(reviewList.author))){
        req.flash("errorMsg","You are not an authorized user")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

// validating middleware , Middleware Function for Error Handling
module.exports.validateSchema=(req,res,next)=>{
    console.log(req.body)
    let {error} = listingSchema.validate(req.body)  //server side validations using joi schema .The validation is handled by joi.Here, the individual field is checked based on server side schema -> listingSchema and then entered to db based on listing collection.
    if (error){
        throw new expressError(400,error)
    }
    else{
        next();
    }
}
// middleware function for validating comments
module.exports.validateComment=(req,res,next)=>{
    console.log(req.body)
    let {error}=commentSchema.validate(req.body)
    if(error){
        throw new expressError(400 ,error)
    }else{
        next();
    }
}