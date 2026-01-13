const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const {validatereview,  isloggedIn, isReviewAuthor} = require("../middleware.js");

const reviewcontroller = require("../controllers/review.js");

//Review
//POST Review route
router.post(
  "/",isloggedIn,
  validatereview,
  wrapAsync(reviewcontroller.postReview)
);

//Delete Review route
router.delete(
  "/:reviewID",
  isloggedIn,
  isReviewAuthor,
  wrapAsync(reviewcontroller.destroyReview)
);

module.exports = router;
