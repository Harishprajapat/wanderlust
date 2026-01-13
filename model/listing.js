const mongoose = require("mongoose");
const { type } = require("os");
const { title, ref } = require("process");
const Review = require("./review");
const { string } = require("joi");
const { url } = require("inspector");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
//     title: {
//         type :String,
//         required : true,
//     },
//     description: String,
//   image: {
//         filename: String,
//         url: {
//             type: String,
//             default: "https://unsplash.com/photos/a-hiker-walks-through-a-lush-mountainous-valley-4LN6KxWZ1c4"
//         }
//     },
//     price: Number,
//     location : String,
//     country : String,

 title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
 image: {
  url: String,
  filename: String,
},
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  review :[{
    type : Schema.Types.ObjectId,
    ref : "Review",
  },
  ],
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User" ,
  },

  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

});

listingSchema.post("findOneAndDelete" , async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.review}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;