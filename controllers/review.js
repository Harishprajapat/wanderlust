const Review = require("../model/review");
const Listing = require("../model/listing.js");


module.exports.postReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
     newReview.author = req.user._id;
     
    // Save the review first, then push its _id to the listing
    await newReview.save();
    listing.review.push(newReview._id);

    await listing.save();

    console.log("new review saved");
    req.flash("success", "New Review Created!!");
    res.redirect(`/listings/${req.params.id}`);
  };

  module.exports.destroyReview = async (req, res) => {
      let { id, reviewID } = req.params;
  
      await Listing.findByIdAndUpdate(id, { $pull: { review: reviewID } });
      await Review.findByIdAndDelete(reviewID);
      req.flash("success", "Deleted review sucessfully!!");
  
      res.redirect(`/listings/${id}`);
    };