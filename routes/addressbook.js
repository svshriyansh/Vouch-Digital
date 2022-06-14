/**
 * @author Shriyansh Vishwakarma <shriyanshsv@outlook.com>
 */
const router = require("express").Router();
const addressbook = require("../models/Addressbook.js");
const authenticationToken = require("../middleware/auth");
const paginationResult = require("../middleware/pagination");

/**
  @route POST address/
  @desc Post details
  @access public
*/
router.post("/", authenticationToken, async (req, res) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let address = req.body.address;
  let phoneNo = req.body.phoneNo;
  try {
    let user = await addressbook.findOne({ phoneNo: phoneNo });
    if (user) {
      res.send("Phone Number already registered");
    }
    record = new addressbook({
      firstname: firstname,
      lastname: lastname,
      address: address,
      phoneNo: phoneNo,
    });
    record = await record.save();
    res.json(record);
  } catch (error) {
    console.log(error);
    res.status(500).JSON("Internal Server error");
  }
});

/**
  @route GET address/users
  @desc Get the user data in pagination format
  @access public
*/
router.get(
  "/users",
  authenticationToken,
  paginationResult,
  async (req, res) => {
    console.log("in route");
    res.json(res.paginatedResults);
  }
);

/**
  @route POST address/bulk
  @desc Post details in bulk
  @access public
*/
router.post("/bulk", authenticationToken, async (req, res) => {
  try {
    const data = req.body;
    const options = { ordered: true };
    for (let i = 0; i < data.length; i++) {
      if (
        !data[i].firstname ||
        !data[i].lastname ||
        !data[i].address ||
        !data[i].phoneNo
      ) {
        return res.json({ message: "Field missing" });
      }
    }
    await addressbook.insertMany(data, options);
    res.send("Inserted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

/** 
  @route GET address/
  @desc Get addressbook details in database
  @access public
*/
router.get("/", authenticationToken, async (req, res) => {
  try {
    let user = await addressbook.find();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
/** 
  @route GET address/user
  @desc Get addressbook details of a particular user
  @access public
*/
router.get("/:phoneNo", authenticationToken, async (req, res) => {
  try {
    if (!req.body.phoneNo) {
      return res.status(400).send("Phone number missing");
    }
    console.log(req.body.phoneNo);
    let user = await addressbook.findOne({ phoneNo: req.body.phoneNo });
    if (!user) {
      return res.send("Phone number not registered");
    }
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

/** 
  @route Put address/:phoneNo
  @desc Update addressbook details of a particular user from phone number
  @access public
*/
router.put("/:phoneNo", authenticationToken, async (req, res) => {
  const { firstname, lastname, address, phoneNo } = req.body;
  const update = { firstname, lastname, address, phoneNo };
  try {
    if (
      !update.firstname ||
      !update.lastname ||
      !update.address ||
      !update.phoneNo
    ) {
      return res.status(400).send("Feild messing");
    }
    let user = await addressbook.findOneAndUpdate(
      { phoneNo: req.params.phoneNo },
      update
    );
    if (user == null) {
      res.status(400).json({ error: [{ message: "No user found" }] });
    }
    user.firstname = update.firstname;
    user.lastname = update.lastname;
    user.address = update.address;
    user.phoneNo = update.phoneNo;
    res.status(200).json({
      message: "User has been successfully updated",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server error");
  }
});

/** 
  @route DELETE address/:phoneNo
  @desc Delete addressbook details of a particular user from phone number
  @access public
*/
router.delete("/:phoneNo", authenticationToken, async (req, res) => {
  try {
    if (!req.body.phoneNo) {
      return res.status(400).send("Phone number missing");
    }
    let user = await addressbook.deleteOne({ phoneNo: req.params.phoneNo });
    if (!user) {
      return res.send("Phone number not registered");
    }
    if (user.deletedCount == "0") {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User has been deleted successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
