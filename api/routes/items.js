const express = require("express");

const data = require("../data/cards");

const Item = require("../models/ItemSchema");
const mongoose = require("mongoose");

const router = express.Router();

//---ADDING A NEW ITEM---
router.post("/", async (req, res) => {
  try {
    const newItem = new Item({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      startBid: req.body.startBid,
      bidTime: req.body.bidTime,
      image: req.body.image,
      description: req.body.description,
      category: req.body.category,
    });

    newItem.save();
    res.status(200).json({
      message: "item created successfully",
      itemCreated: newItem,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
    });
  }
});

// router.post("/isertmany", async (req, res) => {
//   try {
//     await Item.insertMany(data);
//     res.status(200).json({
//       message: "the items are inserted",
//       items: data,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error,
//     });
//   }
// });

router.get("/", async (req, res) => {
  //  Item.insertMany({
  //     name: "Clay pot",
  //     startBid: 245,
  //     bidTime: "",
  //     image: "../assets/pots.jpg",
  //     description:
  //       "Clay pots (hari) were chiefly used in food preparation. The life of the Shona individual could not be without pottery. Food consumption and existence go hand in hand. Figuratively, individuals could be taken as pots. Such was the importance of clay pots among the Shona. Expressions like “dzava hari dzofanzirofa (they are now old pots boiling to breaking point)” were used to describe the old people nearing the end of life",
  //     category: "cutlery",
  //   });

  try {
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
    const category = req.body.category;
    // const updateImage = req.body.category;
    const bidTime = req.body.bidTime;
    const fetchedItem = await Item.findById(id);

    // console.log(fetchedItem.startBid, newBid);
    // if (fetchedItem.startBid > newBid) {
    //   return res.status(300).json({
    //     message: `new bid value of ${newBid} is less than the start bid price of ${fetchedItem.startBid},new bid price should be higher than the startbid price`,
    //   });
    // }

    const updatedItem = await Item.updateMany(
      { _id: id },
      {
        $set: {
          // image: updateImage,
          startBid: newBid,
          bidTime: bidTime,
          category: category,
        },
      }
    );

    console.log(updatedItem);
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

//DELETING AN ITEM FROM THE DATABASE----

router.delete("/:itemId", async (req, res) => {
  try {
    const id = req.params.itemId;
    await Item.findByIdAndDelete(id);
    const newList = Item.find();

    res.status(200).json({
      message: "Successfully deleted item",
      newList: newList,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error,
    });
  }
});

// UPDATING CATEGORIES FOR THE ITEMS IN STOCK
// router.patch('/:itemId', async (req, res) => {
//   try {
//     const id = req.params.itemId;
//     // const item = await Item.findById(id);

//     const category = req.body.category;

//     const updatedItem = await Item.updateMany(
//       { _id: id },
//       { $set: { category: category } }
//     );

//     res.status(201).json({
//       message: `New category is ${category}`,
//       item: updatedItem,
//     });

//   } catch (error) {
//      res.status(500).json({
//        errorMessage: error,

//      });
//   }
// })

module.exports = router;
