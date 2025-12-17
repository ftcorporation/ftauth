const mongoose = require("mongoose");

const LicenseSchema = new mongoose.Schema({
  key: String,
  userId: String,
  active: Boolean,
});

module.exports = mongoose.model("License", LicenseSchema);
