const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//index and create route
router
  .route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(
    isloggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingcontroller.createListing)
  );
  

//new route
router.get("/new", isloggedIn, listingcontroller.renderNewForm);

//show , update and delete route
router
  .route("/:id")
  .get(wrapAsync(listingcontroller.showListing))
  .put(
    isloggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingcontroller.updateListing)
  )
  .delete(isloggedIn, isOwner, wrapAsync(listingcontroller.destroyListing));

//edit route
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingcontroller.renderEditForm)
);

module.exports = router;
