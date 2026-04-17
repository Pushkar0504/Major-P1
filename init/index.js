const mongoose= require('mongoose');
const initData= require('./data.js');
const Listing= require('../models/listing.js');




const mongoURI = 'mongodb://localhost:27017/Wanderlust';

  
main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err =>{
        console.log(err);
    }); 
    
async function main() {
    await mongoose.connect(mongoURI);
}

const initDB= async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map(obj => ({...obj, owner: "65f0c8c7f2c0b2e8f0c8c7f2"}));
    await Listing.insertMany(initData.data);
    console.log("DB Initialized with sample data");
}
initDB();
