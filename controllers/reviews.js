const listing = require("../models/listing");
const review = require("../models/reviews");

module.exports.createReview = async(req,res)=>{
    const reviewSchema = new review(req.body); // new review created
    reviewSchema.author=req.user._id //adding author i.e logged in user
    const reqlisting=await listing.findById(req.params.id) // list where review created with the help of id
    // console.log(reqlisting)// null when req.params.id failed to get pass from app.js and come to route files. soln-> mergeParams
    reqlisting.reviews.push(reviewSchema);// error 
    await reviewSchema.save();
    await reqlisting.save();
    res.redirect(`/listings/${req.params.id}`)
}

module.exports.destroyReview=async(req,res)=>{
    let {id,review_id}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{review:review_id}});
    await review.findByIdAndDelete(review_id);
    res.redirect(`/listings/${id}`)
}