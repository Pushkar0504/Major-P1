if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET);


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js'); 
const path = require('path');
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const Review= require("./models/review.js");
const cookieParser= require("cookie-parser");
const flash= require("connect-flash");
const session= require("express-session");
const MongoStore = require('connect-mongo').default;
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");
const { isLoggedIn, saveRedirectUrl,isOwner, validateListing, validateReview,isReviewAuthor } = require('./middleware.js');

const listingController= require("./controllers/listing.js");
const reviewController= require("./controllers/review.js");
const usersController= require("./controllers/users.js");
const multer  = require('multer');
const { storage } = require('./cloudconfig.js');
const upload = multer({ storage: storage });
const dbUrl= process.env.ATLASDB_URL;



 




const mongoURI = 'mongodb://localhost:27017/Wanderlust';

 async function main() {
    await mongoose.connect(dbUrl);
 }

main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err =>{
        console.log(err);
    });

 

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: 'process.env.SECRET',
    },
    touchAfter: 24 * 60 * 60,  
});

    
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,

    },
};
store.on("error", ()=>{
    console.log("MongoStore error:", err);
});

 


app.set('view engine', 'ejs');
app.set('views',[path.join(__dirname, 'views'),path.join(__dirname, "classroom/views")]);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
// expose the uploads folder so multer-saved files can be served
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser("secretcode"));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next();
});

 

// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// });


 


// routing for listings - using `app` directly because `router` was not defined
app.route("/listings")
  .get(wrapAsync(listingController.index))
  // accept one file under the field name "listing[image]" so it matches the form
  .post(  isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingController.createListing));
  

app.route("/listings/new")
  .get(isLoggedIn, listingController.renderNewForm);

app.route("/listings/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



 



app.get("/listings/:id/edit",isLoggedIn, isOwner, wrapAsync( listingController.editListing));




 

app.post("/listings/:id/reviews", isLoggedIn, validateReview, wrapAsync( reviewController.createReview));

app.delete("/listings/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync( reviewController.destroyReview));

app.all("/",(req,res,next)=>{
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next )=>{
    let{statusCode=500, message="Something went Wrong!"}= err;
    // set status then render the error template; avoid sending twice
    res.status(statusCode).render("error.ejs",{message});
});

 
app.route("/signup")
  .get(usersController.renderSignupForm)
  .post(wrapAsync(usersController.signup));

app.route("/login")
  .get(usersController.renderLoginForm)
  .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", failureFlash: true,}), usersController.login);
   

app.get("/logout", usersController.logout);


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
