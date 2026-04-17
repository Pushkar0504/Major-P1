// const express= require("express");
// const router= express.Router();
// const wrapAsync= require("../utils/wrapAsync.js");
// const {listingSchema, reviewSchema}= require("../schema.js");
// const ExpressError= require("../utils/ExpressError.js");
// const Listing = require('../models/listing.js'); 

// const vaidateListing= (req,res,next)=>{
//     let {error}= listingSchema.validate(req.body);
//     if(error){
//         let errMsg= error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400, errMsg);

//     }else{
//         next();
//     }
// };

// router.get("/", wrapAsync(async(req, res) => {
//      const alllistings = await Listing.find({});
//      res.render("listings/index.ejs",{alllistings});
//     }));

// router.get("/new", (req,res)=>{
//         res.render("listings/new.ejs");
//     });

// router.get("/:id", wrapAsync(async(req, res) => {
//     const {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing});
//     }));

// router.post("/", wrapAsync(async(req,res)=>{
     
    
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
     
// }));

// router.get("/:id/edit", wrapAsync(async(req,res)=>{
//     const {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});

// }));


// router.put("/:id", wrapAsync(async(req,res)=>{
//     if(!req.body.listing){
//         throw new ExpressError(400, "Send Valid data for listing");
//     }
    
 
//         let {id}= req.params;
//         await Listing.findByIdAndUpdate(id, {...req.body.listing}, { runValidators: true });
//         res.redirect(`/listings/${id}`);
     
//     }));

// router.delete("/:id", wrapAsync(async(req,res)=>{
//     let {id}= req.params;
//     let deletedListing= await Listing.findByIdAndDelete(id);
//     console.log("deletedListing");
//     res.redirect("/listings");
// }));

// router.post("/:id/reviews", async(req,res)=>{
//     let listing= await Listing.findById(req.params.id);
//     let newReview= new Review(req.body.review);
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//     console.log("new review saved");
//     res.redirect(`/listings/${listing._id}`);

// });

// router.delete("/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
//     let {id, reviewId}= req.params;
//     await Listing.findByIdAndUpdate(id, {pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }) );

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });


// module.exports= router;