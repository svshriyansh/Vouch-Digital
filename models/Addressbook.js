/**
 * @author Shriyansh Vishwakarma <shriyanshsv@outlook.com>
 */
const mongoose = require("mongoose");
const AddressBookSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("addressbook", AddressBookSchema);
