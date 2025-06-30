if(process.env.NODE_ENV!= "production"){ // in development phase only it needs to be integrated with backend
    require('dotenv').config()  // to integrate with backend dotenv package is used
}



const express = require("express");
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema}= require("../schema.js") //joi schema
const router = express.Router({mergeParams:true})
const {isLoggedIn,authorizeUser,validateSchema} = require("../middleware.js");
const listingControllers = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage }) // used for post create route, now the image file will be uploaded in cloud storage


router.route("/")
    .get(wrapAsync(listingControllers.allListings)) //all listings
    .post(isLoggedIn,upload.single('url'),validateSchema,wrapAsync(listingControllers.createNewList)) // post request for create new list 
    // note: validateSchema must be written after upload , if written before req.body will show {} becoz express couldnt parse the image format , so once it is parsed
    // by multer, then will be stored in string format

router.get('/new',isLoggedIn,listingControllers.renderNewList) //add new list
router.get("/search",wrapAsync(listingControllers.searchLists))//search 
router.route("/:id")
    .patch(isLoggedIn,authorizeUser,upload.single('url'),validateSchema,wrapAsync(listingControllers.updateExistingList)) //update list post req
    .get(wrapAsync(listingControllers.showList))  // show route
    .delete(isLoggedIn,authorizeUser,wrapAsync(listingControllers.deleteList)) //delete listings

router.get('/:id/edit',isLoggedIn,wrapAsync(listingControllers.renderExistingList))  // update existing list 

module.exports=router;