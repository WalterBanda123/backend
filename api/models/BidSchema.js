const mongoose = require("mongoose");

const autoBidSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
  percentage: Number,
  amount: Number,
  _itemId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  _userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("AutoBid", autoBidSchema);
