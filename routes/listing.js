const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing, hasCoordinates} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( listingController.renderEditForm ));

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync( listingController.createListing ));
    
router.route("/:id")
    .get(wrapAsync( listingController.showListing ))
    .put(isLoggedIn, isOwner, upload.single('listing[image]') , validateListing, wrapAsync( listingController.updateListing ))
    .delete(isLoggedIn, isOwner, wrapAsync( listingController.destroyListing ));

module.exports = router;