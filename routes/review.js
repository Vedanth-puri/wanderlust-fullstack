const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../Models/review.js");
const listing = require("../Models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, validateListing, validateReview, isReviewAuthor } = require("../middleware.js");


const reviewController = require("../controllers/review.js");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;