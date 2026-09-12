const mongoose = require('mongoose');
const initData = require("./data.js");
const listing = require("../Models/listing.js"); 

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

async function main() {
     await mongoose.connect(MONGO_URL);
}

main()
.then(() =>{
    console.log("Db Connected ! :)");
})
.catch((err) => {
    console.log(err);
});


const initDB = async () => {
    await listing.deleteMany({});
    initData.data= initData.data.map((obj) => ({...obj, owner :"6a9d7119560f23c2019f17aa"}));
    await listing.insertMany(initData.data);
    console.log("Added Successfully!");
};

initDB();