var mongoose    =   require ("mongoose"),
    Campground  =   require ("./models/campground"),
    Comment     =   require ("./models/comment");
    
    var data = [
        
            {name: "Salmon Creek", image: "https://farm3.staticflickr.com/6088/6067525183_f4ed5d5af8_o.jpg", description:"Bacon ipsum dolor amet boudin strip steak pork loin, cupim jowl beef ribs pastrami corned beef jerky. T-bone sirloin sausage, biltong pig ham hock tongue turkey. Biltong cupim landjaeger spare ribs swine, chicken ball tip tail meatball. Shank corned beef strip steak, ribeye meatball turducken meatloaf."},
            {name: "Granite Hill", image: "https://c2.staticflickr.com/8/7248/7736022322_d9e9671d75_o.jpg", description:"Bacon ipsum dolor amet boudin strip steak pork loin, cupim jowl beef ribs pastrami corned beef jerky. T-bone sirloin sausage, biltong pig ham hock tongue turkey. Biltong cupim landjaeger spare ribs swine, chicken ball tip tail meatball. Shank corned beef strip steak, ribeye meatball turducken meatloaf."},
            {name: "Mountain Goats Rest", image: "https://farm5.staticflickr.com/3839/15171684621_1fae6b3c92_o.jpg", description:"Bacon ipsum dolor amet boudin strip steak pork loin, cupim jowl beef ribs pastrami corned beef jerky. T-bone sirloin sausage, biltong pig ham hock tongue turkey. Biltong cupim landjaeger spare ribs swine, chicken ball tip tail meatball. Shank corned beef strip steak, ribeye meatball turducken meatloaf."}
        
    ]
    
function seedDB(){
    
    Comment.remove({}, function(err){
       if(err){
           console.log(err);
       }
    });
    
    // Remove all campgrounds
    Campground.remove({}, function(err){
      if(err){
          console.log(err);
      } 
        // console.log("removed campgrounds!");
        // // add a few campgrounds
        // data.forEach(function(seed){
        //     Campground.create(seed, function(err, campground){
        //         if(err){
        //             console.log(err);
        //         } else {
        //             console.log("added a campground");
        //             //create a comment
        //             Comment.create(
        //                 {
        //                     text:   "this is a great place",
        //                     author: "Homer"
        //                 }, function(err, comment){
        //                     if(err){
        //                         console.log(err);
        //                     } else {
        //                         campground.comments.push(comment);
        //                         campground.save();
        //                         console.log("Created new comment");
        //                     }
        //                 });
        //         }
        //     });
        // });
    });
    //add a few comments
}

module.exports = seedDB

//  Campground.create({}, function(err){
//       if(err) {
//           console.log(err);
//       } 
//     });