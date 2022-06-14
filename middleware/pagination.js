/**
 * @author Shriyansh Vishwakarma <shriyanshsv@outlook.com>
 */
const addressbook = require("../models/Addressbook");
// pagination function will use to paginate the details

async function paginationResult(req, res, next) {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skipIndex = (page - 1) * limit;
  try {
    await addressbook
      .find()
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .exec(function (err, docs) {
        res.paginatedResults = docs;
        console.log(res.paginatedResults);
        next();
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error Occured" });
  }
}

module.exports = paginationResult;
