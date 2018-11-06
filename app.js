var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
// requiring routes
    var commentRoutes   = require("./routes/comments"),
        reviewRoutes     = require("./routes/reviews"),
        campgroundRoutes = require("./routes/campgrounds"),
        authRoutes = require("./routes/index");

mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
//mongoose.connect("mongodb://rhys:1lovejess@ds147233.mlab.com:47233/yelpcamp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again I only love Jess",
    resave: false,
    saveUninitialized: false
}));
app.locals.moment = require("moment");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(process.env.PORT, process.env. IP, function() {
   console.log("YelpCamp server has started"); 
});
 