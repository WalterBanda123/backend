const express = require("express");
//const items = require("../models/itemsMock");
const Item =  require('../models/ItemSchema');
const checkAuth = require('../middleware/auth')

const router = express.Router();

router.get("/", checkAuth, async (req, res) => {

  try {
  // Item.insertMany(items)
    const fetchedItemList = await Item.find();
    res.status(201).json({
      message: "fetched all the items",
      items: fetchedItemList,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
    });
  }
});

//---ROUTE TO BID ON AN ITEM/ SETTING NEW BIT PRICE
router.patch("/:itemID", checkAuth , async (req, res) => {
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
   
   const updatedItem = await Item.updateOne({_id:id}, {$set:{startBid: newBid}});

    res.status(201).json({
      message: `New bid price is ${newBid}`,
      item: updatedItem,
      fetchedItem:fetchedItem
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
      text:"could not update bid price"
    });
  }
});


//--GETTING ITEM BY ID----
router.get("/:itemID",  checkAuth  , async (req, res) => {
  try {
    const id = req.params.itemID;
    const itemSelected = await Item.findById(id)

    res.status(201).json({
      message: "selected item",
      item: itemSelected,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
    });
  }
});

module.exports = router;
