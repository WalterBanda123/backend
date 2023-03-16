const express = require("express");
//  const items = require("../models/itemsMock");
const data = require("../data/cards");

const Item = require("../models/ItemSchema");
const checkAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Item.insertMany(data)
    const fetchedItemList = await Item.find();
    res.status(201).json({
      message: "fetched successfully",
      items: fetchedItemList,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
    });
  }
});

//---ROUTE TO BID ON AN ITEM/ SETTING NEW BIT PRICE
router.patch("/:itemID", async (req, res) => {
  try {
    const id = req.params.itemID;
    const newBid = Number(req.body.newBid);
    const fetchedItem = await Item.findById(id);

    // console.log(fetchedItem.startBid, newBid);

    if (fetchedItem.startBid > newBid) {
      return res.status(300).json({
        message: `new bid value of ${newBid} is less than the start bid price of ${fetchedItem.startBid},new bid price should be higher than the startbid price`,
      });
    }

    const updatedItem = await Item.updateOne(
      { _id: id },
      { $set: { startBid: newBid } }
    );

    res.status(201).json({
      message: `New bid price is ${newBid}`,
      item: updatedItem,
      fetchedItem: fetchedItem,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
      text: "could not update bid price",
    });
  }
});

//--GETTING ITEM BY ID----
router.get("/:itemID", async (req, res) => {
  try {
    const id = req.params.itemID;
    const itemSelected = await Item.findById(id);

    res.status(201).json(itemSelected);
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
    });
  }
});

module.exports = router;
