const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  startBid: Number,
  bidTime: String,
  image: String,
  description: String,
  category:String,
  autoBid:[{type : mongoose.Schema.Types.ObjectId, ref:'AutoBid'}]
});



module.exports = mongoose.model("Item", itemSchema);

