const listing = require("../models/listing")
const express = require("express");



module.exports.allListings =async (req,res)=>{
    const listingData = await listing.find({})
    res.render("listings/allListings.ejs",{listingData})
}

module.exports.renderNewList =(req,res)=>{
    console.log(req.user)
    res.render("listings/newList.ejs");
}

module.exports.createNewList =async(req,res,next)=>{ // database tasks are asynchronous , therefore for error handling wrapAsync is used.
    req.body= {...req.body,owner:req.user._id} // by default adding a owner using request object , becoz it contains the info of current logged-in info.
    let url= req.file.path;
    let filename =req.file.filename;
    req.body.image ={url,filename} // adding two fields according to schema 
    await listing.insertMany(req.body)
    req.flash("successMsg","list created successfully !")
    res.redirect("/listings")
}

module.exports.renderExistingList = async(req,res)=>{
    let {id} = req.params;
    let editingList = await listing.findById(id)
    if (!editingList){  // api protection when directly accessed through api
        req.flash("errorMsg","list doesn't exist !")
        return res.redirect("/listings")
    }
    const OriginalPath = editingList.image.url.replace("/upload","/upload/h_200,w_250") // changing the size of the image 
    res.render("listings/listEdit.ejs",{editingList,OriginalPath})
}

module.exports.updateExistingList =async(req,res)=>{
    let {id} = req.params;
    if (req.file){ 
        let url = req.file.path;
        let filename = req.file.filename;
        req.body.image= { url,filename}
    }
    await listing.findByIdAndUpdate(id, {...req.body})   
    res.redirect("/listings")
}

module.exports.showList =async(req,res)=>{
    let { id:req_id}= req.params;
    let listInfo = await listing.findById(req_id)
    .populate({path:'reviews',populate:{path:'author'}}) // here for each listing reviews & owner info of list is populated and for each review, reviews author is populated.
    .populate('owner');
    console.log(listInfo)
    console.log(res.locals.currentUser)
    if (!listInfo){
        req.flash("errorMsg","list doesn't exist !")
        res.redirect("/listings")
    }
    res.render("listings/showLists.ejs",{listInfo})
}

module.exports.deleteList= async(req,res)=>{
    let {id}= req.params;
    let list = await listing.findByIdAndDelete(id);
    req.flash("successMsg","list deleted successfully !")
    res.redirect("/listings");
}

module.exports.searchLists=async (req,res)=>{
    let {filter}=req.query;
    let Capitalize=filter[0].toUpperCase() + filter.slice(1,)
    let listingData = await listing.find({})
    console.log(listingData)
    let filterArr=[]
    for (list of listingData){
        if (list.country.includes(Capitalize)){
            filterArr.unshift(list)
        }
    }
    listingData  = filterArr
    console.log(listingData)
    res.render("listings/allListings.ejs",{listingData})
}