var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var Review = require("../models/review");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

router.get("/", function(req, res) {
        if(req.query.search){
            escapeRegex(req.query.search);
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Campground.find({name: regex}, function(err, allCampgrounds){
               if(err) {
                   console.log(err);
               }  else {
                   res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
               }
            });
        }
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
           if(err) {
               console.log(err);
           }  else {
               res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
           }
        });
});

// router.post("/", middleware.isLoggedIn, function(req, res){
//     var name = req.body.name;
//     var price = req.body.price;
//     var image = req.body.image;
//     var dlc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     };
//     var newCampground = {name: name, price: price, image: image, description: dlc, author: author};
//     // Create a new campground and save to DB
//     Campground.create(newCampground, function(err, newlyCreated){
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(newlyCreated);
//             //redirect back to campgrounds page
//             res.redirect("/campgrounds");
//         }
//     });

// });

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
});

// router.get("/:id", function(req, res) {
//     //find the campground with provided ID
//     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
//         if(err) {
//             console.log(err);
//         } else {
//             //Render campground with that ID
//             res.render("campgrounds/show", {campground: foundCampground});
//         }
//     });
//     req.params.id;
//     //Render campground with that ID

// });

// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
                res.render("campgrounds/edit", {campground: foundCampground});
        });
});
 
// UPDATE CAMPGROUND ROUTE

// router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
//     // find and update the correct campground
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampsite){
//         if(err){
//             res.redirect("/campgrounds");
//         }   else    {
//             delete req.body.campground.rating;
//             res.redirect("/campgrounds/" + req.params.id);
//         }
//     });
//     // redirect somewhere(show page)
// });

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

// // DESTROY CAMPGROUND
// router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
//     Campground.findByIdAndRemove(req.params.id, function(err){
//         if(err){
//             res.redirect("/campgrounds");
//         }   else    {
//             req.flash("success", "Campground deleted");
//             res.redirect("/campgrounds");
//         }
//     });
// });

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // deletes all comments associated with the campground
            Comment.remove({"_id": {$in: campground.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.remove({"_id": {$in: campground.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.remove();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;