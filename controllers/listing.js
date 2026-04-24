const Listing = require("../models/listing");
const nodeGeocoder = require('node-geocoder');

const geocoder = nodeGeocoder({
    provider: 'openstreetmap',
});

 


// controller exports only; routes are defined in app.js

module.exports.index= async(req, res) => {
     const alllistings = await Listing.find({});
     res.render("listings/index.ejs",{alllistings});
    };

module.exports.renderNewForm= (req,res)=>{
        res.render("listings/new.ejs");
 
    }

module.exports.showListing= async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested does not exist" );
        return res.redirect("/listings");
    }
     
    res.render("listings/show.ejs",{listing});
    };

module.exports.createListing= async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner= req.user._id;
    newListing.image= {url, filename};
    
    // Geocode the location
    let address = `${newListing.location}${newListing.country ? ', ' + newListing.country : ''}`;
    let geoData = await geocoder.geocode(address);

    // Fallback: try just the location if country makes it fail
    if (!geoData.length && newListing.location) {
        geoData = await geocoder.geocode(newListing.location);
    }

    if (geoData.length > 0) {
        newListing.geometry = {
            type: 'Point',
            coordinates: [geoData[0].longitude, geoData[0].latitude]
        };
    } else {
        console.warn('Geocoding failed for address:', address);
        // Fallback: set default coordinates (e.g., center of the world or a placeholder)
        newListing.geometry = {
            type: 'Point',
            coordinates: [0, 0]  // Default to null island or handle appropriately
        };
    }

    await newListing.save();
    console.log('Saved listing with geometry:', newListing.geometry);
    req.flash("success", "New Listing Created!" );
    res.redirect("/listings");
};

module.exports.editListing= async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing you requested does not exist" );
        res.redirect("/listings");
    }
    let originalImageUrl= listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_200");
    res.render("listings/edit.ejs",{listing, originalImageUrl});

};

module.exports.updateListing= async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400, "Send Valid data for listing");
    }
    
 
        let {id}= req.params;
        // Ensure we have the most recent values for geocoding
        const updatedData = {...req.body.listing};
        let listing = await Listing.findByIdAndUpdate(id, updatedData, { runValidators: true, new: true });

        // Geocode the location if it was updated (or missing)
        if (listing) {
            const address = `${updatedData.location || listing.location}${(updatedData.country || listing.country) ? ', ' + (updatedData.country || listing.country) : ''}`;
            let geoData = await geocoder.geocode(address);
            if (!geoData.length && (updatedData.location || listing.location)) {
                geoData = await geocoder.geocode(updatedData.location || listing.location);
            }
            if (geoData.length > 0) {
                listing.geometry = {
                    type: 'Point',
                    coordinates: [geoData[0].longitude, geoData[0].latitude]
                };
            } else {
                console.warn('Geocoding failed for address:', address);
            }
        }

        if(typeof req.file !== "undefined"){
            let url=req.file.path;
            let filename=req.file.filename;
            listing.image= {url, filename};
        }

        await listing.save();
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
     
    };

module.exports.destroyListing= async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log("deletedListing");
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};