/**
 * @author Shriyansh Vishwakarma <shriyanshsv@outlook.com>
 */
const auth = require("./auth");
const addressbook = require("./addressbook");
const router = require("express").Router();
router.use("/address", addressbook);
router.use("/auth", auth);
module.exports = router;
