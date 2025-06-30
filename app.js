const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing");
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const review = require('./models/reviews.js');
const listingsRoute = require('./routes/listingsRoute.js');
const reviewRoute = require('./routes/reviewRoute.js');
const session = require("express-session");
const mongoStore = require("connect-mongo") // instead of local storage
const flash= require("connect-flash");
const User = require("./models/user.js");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const userRoute = require("./routes/userRoute.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

// Database Connection 
// const LOCAL_URL ='mongodb://127.0.0.1:27017/wanderlust'
const dbUrl=process.env.ATLASDB_URL
main()
    .then(()=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log(err)
    })
    async function main(){
        await mongoose.connect(dbUrl);
    }

main()
.then(()=>{
    console.log("Database connected succesfully")
})
.catch((err)=>{
    console.log(`Error ${err}`)
})
//mongo store
const store = mongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600 // updates stored after 24hrs, if no changes
})
// store error
store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err)
})

// session creation
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*100, // cookie will expire in 7 days fromm now
        maxAge:7*24*60*60*100,
        httpOnly:true, // security  purpose (cross-scripting attacks)
    }
}

app.use(session(sessionOptions));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()) // important
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("successMsg"); // res.locals.successMsg initially is an empty array
    res.locals.errorMsg = req.flash("errorMsg");
    res.locals.currentUser =req.user
    next();
})


app.get("/",async (req,res)=>{
    const listingData = await listing.find({})
    res.render("listings/allListings.ejs",{listingData})
})

// user signup route
app.use("/",userRoute)

// All Listings route
app.use("/listings",listingsRoute)
// review route  
app.use("/listings/:id/review",reviewRoute)

app.all('/*splat',(req,res,next)=>{
    next(new expressError(404,"page not found ")) ; // expressError is a new class created on the basis of error class. next will execute the middleware.
})

// error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message='something went wrong '}= err;
    console.log(err)
    res.status(statusCode).render("listings/error.ejs",{message})
})

app.listen(8080,(req,res)=>{
    console.log("server started")
});