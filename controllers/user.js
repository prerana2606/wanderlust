
const express = require("express");
const User = require("../models/user");

module.exports.signUpPage=(req,res)=>{
    res.render("User/signup.ejs")
}
module.exports.signUp=async(req,res)=>{
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username }) // else other things will be added by passport
        const registeredUser = await User.register(newUser,password); // passport method
        req.login(registeredUser,(err)=>{ // automatically logged in once signed up
            if (err){
                return next(err);
            }
            req.flash("successMsg","Welcome To Wanderlust");
            res.redirect("/listings")
        })
        
    } catch (error) {
        req.flash("errorMsg",error.message); // try-block applied so that flash mssg is flashed on signup page itself
        res.redirect("/signup")
    }
    
}

module.exports.loginPage=(req,res)=>{
    res.render("User/login.ejs")
}

module.exports.loggedIn =async (req, res) => { //failureFlash() will automatically flash the mssg if user doesnt exist

    req.flash("successMsg", "Welcome To Wanderlust")
    const RedirectUrl =res.locals.redirectUrl || "/listings"
    res.redirect(RedirectUrl)
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if (err){
            return next(err);
        }
    })
    req.flash("successMsg","you logged Out")
    res.redirect("/listings")
}