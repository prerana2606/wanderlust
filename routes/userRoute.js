const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl,authorizeUser} = require("../middleware.js");
const { signUp, loginPage,loggedIn ,logout, signUpPage} = require("../controllers/user.js");

router.route("/signup")
    .get(signUpPage) // signup page
    .post(signUp)

router.route("/login")
    .get(loginPage)
    .post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true}),loggedIn)

router.get("/logout",logout)
module.exports = router