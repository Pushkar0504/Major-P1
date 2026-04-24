const mongoose= require('mongoose');
const initData= require('./data.js');
const Listing= require('../models/listing.js');




const mongoURI = 'mongodb://localhost:27017/Wanderlust';

  
async function main() {
    await mongoose.connect(mongoURI);
}

const initDB= async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map(obj => ({...obj, owner: "65f0c8c7f2c0b2e8f0c8c7f2"}));
    await Listing.insertMany(initData.data);
    console.log("DB Initialized with sample data");
}

main().then(() => {
    console.log('Connected to MongoDB');
    initDB();
}).catch(err => {
    console.log(err);
});
