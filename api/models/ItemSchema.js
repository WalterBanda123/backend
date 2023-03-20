const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  startBid: Number,
  bidTIme: Date,
  image: String,
  description: String,
  category:String
});



module.exports = mongoose.model("Item", itemSchema);

