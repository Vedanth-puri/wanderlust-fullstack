const Review = require("../Models/review.js");
const listing = require("../Models/listing.js");

module.exports.createReview = (async (req, res) => {
  let { id } = req.params;
  let list = await listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  list.reviews.push(newReview);
  await newReview.save();
  await list.save();
  req.flash("success", "New Review Added Successfully");
  res.redirect(`/listings/${list._id}`);
});

module.exports.destroyReview = (async (req, res) => {
  let { id, reviewId } = req.params;

  await listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  
  req.flash("success", "Review Deleted Successfully");
  res.redirect(`/listings/${id}`)
});