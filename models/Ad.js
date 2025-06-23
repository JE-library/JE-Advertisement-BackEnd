const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  adID: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: [{ type: String, required: true }],
  price: { type: Number, required: true },
  imageURL: { type: String, required: true },
});

const Ads = mongoose.model("Ads", adSchema);
module.exports = Ads;
