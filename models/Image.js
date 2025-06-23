const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  adID: { type: String, required: true, unique: true },
  public_id: { type: String, required: true },
  url: { type: String, required: true },
  name: { type: String, required: true },
});

const Images = mongoose.model("Images", imageSchema);
module.exports = Images;