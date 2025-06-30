
const express = require("express");
const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {commentSchema} = require("../schema.js") // joi schema
const review = require('../models/reviews.js');
const router = express.Router({mergeParams:true}) // {mergeParams:true} => parent route merge with child route
const {isLoggedIn,authorizeReviewUser,validateComment} = require("../middleware.js");
const { createReview , destroyReview} = require("../controllers/reviews.js");

// middleware function for validating comments


router.post("/",isLoggedIn,validateComment,wrapAsync(createReview))

// delete review route
router.delete("/:review_id",isLoggedIn,authorizeReviewUser,wrapAsync(destroyReview))

module.exports=router
