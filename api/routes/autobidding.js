const express = require("express");
const Item = require("../models/ItemSchema");
const User = require("../models/UserSchema");
const AutoBid = require("../models/BidSchema");
const mongoose = require("mongoose");
const { json } = require("body-parser");

const router = express.Router();

//----CREATING AN AUTOBIDDING SITE---

router.post("/", async (req, res) => {
  try {
    const newAutoBid = new AutoBid({
      _id: new mongoose.Types.ObjectId(),
      isActive: req.body.isActive,
      // percentage: req.body.percentage,
      // amount: req.body.amount,
      _itemId: req.body._itemId,
      _userId: req.body._userId,
    });

    newAutoBid.save();
    res.status(200).json({
      message: "successfully created an autobidding request",
      requestInfor: newAutoBid,
    });
  } catch (error) {
    res.status(500),
      json({
        errorMessage: error,
      });
  }
});

router.get("/", async (req, res) => {
  try {
    const bidList = await AutoBid.find();
    res.status(200).json({
      message: "Sucessfully fetched bids",
      bidList: bidList,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
    });
  }
});

// GETTING A BID REQUEST BY ID ---
router.get("/:bidID", async (req, res) => {
  try {
    const id = req.params.bidID;
    const bidRequested = await AutoBid.findById(id);
    res.status(200).json({
      message: "Sucessfully fetched bids",
      bid: bidRequested,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
    });
  }
});

//CHANGING BID STATE , FROM ACTIVE TO INACTIVE
router.patch("/:bidId", async (req, res) => {
  try {
    const id = req.params.bidId;
    const isActiveNew = req.body.isActive;

    const updatedBid = await AutoBid.findOneAndUpdate(
      { _id: id },
      { $set: { isActive: isActiveNew } }
    );

    res.status(200).json({
      message: "Successfully patched bid",
      updatedBid: updatedBid,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
    });
  }
});

router.get("/exist", async (req, res) => {
  try {
    const itemId = req.body.itemId;
    const userId = req.body.userId;

    const resultList = await AutoBid.find().$where({
      _itemId: itemId,
      _userId: userId,
    });
    res.status(200).json({
      message: "Successfully fetched items",
      result: resultList,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
    });
  }
});

module.exports = router;
