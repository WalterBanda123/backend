const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  startBid: Number,
  bidTIme: Date,
  image: String,
});

module.exports = mongoose.model("Item", itemSchema);

