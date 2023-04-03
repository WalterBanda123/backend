const express = require("express");
const bycript = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/auth");

const User = require("../models/UserSchema");

const { default: mongoose } = require("mongoose");
const router = express.Router();

//----GETTING USER BY ID -----

router.get("/:userID", checkAuth, async (req, res) => {
  try {
    const userId = req.params.userID;
    const user = await User.findById(userId);

    res.status(201).json({
      message: "Obtained the user",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

//---GETTING ALL USERS ----
router.get("/", async (req, res) => {
  try {
    // User.insertMany(users);
    const userList = await User.find();
    res.status(201).json({
      allUsers: userList,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
      text: "failed to retrieve users",
    });
  }
});

//----CREATING A NEW USER-----
router.post("/signup", async (req, res) => {
  const existingUser = await User.find({ email: req.body.email });

  if (existingUser.length >= 1) {
    res.status(409).json({
      message: "User with such email exist already.",
    });
  } else {
    bycript.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        res.status(404).json({
          errorMessage: "Auth failed!",
        });
      } else {
        try {
          const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            fullName: req.body.fullName,
            email: req.body.email,
            password: hash,
            role: req.body.role,
            percentage: req.body.percentage,
            amount: req.body.amount,
          });
          newUser.save();

          res.status(201).json({
            message: "created a new user",
            user: newUser,
          });
        } catch (error) {
          res.status(500).json({
            errorMessage: error,
          });
        }
      }
    });
  }
});

//--UPDATING AUTOBID BUDGET AND PERCENTAGE

router.patch("/config/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    const percentage = req.body.percentage;
    const amount = req.body.amount;

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          percentage: percentage,
          amount: amount,
        },
      }
    );

    res.status(200).json({
      message: "Successfully updated the user",
      updatedUser: updatedUser,
    });
  } catch (error) {
    res.status(200).json({
      errorMessage: error,
    });
  }
});
//---UPDATING THE AMOUNT WHEN AUTOBIDDING
router.patch("/new-badget/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    // const percentage = req.body.percentage;
    const newAmount = req.body.amount;

    const updatedUser = await User.updateOne(
      { _id: id },
      {
        $set: {
          // percentage: percentage,
          amount: newAmount,
        },
      }
    );

    const user = await User.findById(id);
    res.status(200).json({
      message: "Successfully updated the user",
      user: user,
      status: updatedUser,
    });
  } catch (error) {
    res.status(200).json({
      message: error,
    });
  }
});

//---LOGGING USER ----

router.post("/login", async (req, res) => {
  const user = await User.find({ email: req.body.email });

  if (user.length < 1) {
    return res.status(401).json({
      error: "Auth failed",
    });
  }

  bycript.compare(req.body.password, user[0].password, async (err, result) => {
    if (err) {
      return res.status(401).json({
        error: "Auth failed",
      });
    }

    if (result) {
      const token = jwt.sign(
        {
          email: user[0].email,
          userId: user[0]._id,
        },
        process.env.ENV_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({
        // message: "Auth was successful",
        _id: user[0]._id,
        token: token,
      });
    }

    res.status(401).json({
      error: "Auth failed",
    });
  });
});

module.exports = router;
