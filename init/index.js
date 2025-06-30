const mongoose = require("mongoose");
const listing = require("../models/listing")
const dataInit = require("./data")
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}
main().then(()=>{
    console.log("database connected for initialization")
})
.catch((err)=>{
    console.log(err)
})

async function dataInitization(){
    await listing.deleteMany({});
    dataInit.data = dataInit.data.map((data)=>({...data,owner:'66b7743a5c7ef3a0ad45f4eb'})) //added owner field with data
    await listing.insertMany(dataInit.data)
    console.log("data initialized")
}

dataInitization()