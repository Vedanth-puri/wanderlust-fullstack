const listing = require("../Models/listing.js");
const { listingSchema } = require("../schema.js");

module.exports.index = async (req, res) => {
  const allLists = await listing.find();
  res.render("listings/index.ejs", { allLists });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const Listing = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!Listing) {
    req.flash("error", "Listing Not Found!");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { Listing });
  }
};

module.exports.createListing = async (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(404, result.error);
  }

  let url = req.file.path;
  let filename = req.file.filename;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(req.body.listing.location)}&format=json&limit=2`,
    {
      headers: {
        "User-Agent": "WanderLust"
      }
    }
  );

  const data = await response.json();

  const longitude = Number(data[0].lon);
  const latitude = Number(data[0].lat);

  req.body.listing.geometry = {
    type: "Point",
    coordinates: [longitude, latitude]
  };

  console.log(url, "..", filename);

  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  let savedListing = await newListing.save();

  console.log(savedListing);

  req.flash("success", "New Listing Added Successfully");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let Listing = await listing.findById(id);
  if (!Listing) {
    req.flash("error", "Listing Not Found!");
    res.redirect("/listings");
  } else {
    let originalImageUrl = Listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { Listing, originalImageUrl });
  }
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  if (!req.body.listing) {
    throw new ExpressError(400, "Send Valid data !");
  }
  Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== "undefined") {
  let url = req.file.path;
  let filename = req.file.filename;
  Listing.image = { url, filename };
  await Listing.save();
  }
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let Listing = await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  console.log(Listing);
  res.redirect("/listings");
};
