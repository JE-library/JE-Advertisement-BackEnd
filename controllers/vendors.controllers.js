const Ads = require("../models/Ad");
const { errorResponse, successResponse } = require("../utils/response");
const cloudinary = require("../configs/cloudinary.config");
const Images = require("../models/Image");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const { addAdSchema } = require("../utils/joi.utils");

//GETTING ALL ADS - VENDOR
const getAllAdVendor = async (req, res) => {
  try {
    const role = req.user.role;
    const username = req.user.username;
    const userID = req.user.userID;
    if (role !== "vendor") {
      const message = errorResponse(
        username,
        `Hey ${username}, please login as an vendor to access this route.`,
        null,
        true
      );
      return res.status(401).json(message);
    }
    //getting all ads from DB
    const ads = await Ads.find({ userID }, { __id: 0, __v: 0 });
    if (ads.length === 0) {
      const message = successResponse(
        username,
        `Sorry ${username}, You have no ads to be displayed.`,
        null
      );
      return res.status(200).json(message);
    }
    //sending ads to client
    const message = successResponse(
      username,
      `Hey ${username}!, your Ads were retrieved successfully!.`,
      ads
    );
    return res.status(200).json(message);
  } catch (error) {
    console.log(error.message);
  }
};
//
//
//
//GETTING A SINGLE AD - VENDOR
const getSingleAdVendor = async (req, res) => {
  try {
    const role = req.user.role;
    const username = req.user.username;
    const userID = req.user.userID;
    if (role !== "vendor") {
      const message = errorResponse(
        username,
        `Hey ${username}, please login as a vendor to access this route.`,
        null,
        true
      );
      return res.status(401).json(message);
    }
    //getting a single ad from DB
    const adID = req.params.adID;
    const matchedAd = await Ads.findOne({ adID, userID }, { __id: 0, __v: 0 });
    if (!matchedAd) {
      const message = successResponse(
        username,
        `Sorry ${username}, there's no ad matching the id - ${adID}.`,
        null
      );
      return res.status(200).json(message);
    }
    //sending ads to client
    const message = successResponse(
      username,
      `Hi ${username}, your Ad retrieved successfully!.`,
      matchedAd
    );
    return res.status(200).json(message);
  } catch (error) {
    console.log(error.message);
  }
};
//
//
//
//
//
//
//
const searchAdsVendor = async (req, res) => {
  try {
    const role = req.user.role;
    const username = req.user.username;
    const userID = req.user.userID;

    if (role !== "vendor") {
      return res
        .status(401)
        .json(
          errorResponse(
            username,
            `Hey ${username}, please login as a vendor to access this route.`,
            null,
            true
          )
        );
    }

    const { title, category, price } = req.query;

    const query = { userID };

    if (title) {
      query.title = { $regex: title.trim(), $options: "i" };
    }

    if (category) {
      query.category = { $in: [category.trim()] };
    }

    if (price) {
      const priceVal = parseFloat(price);
      if (priceVal >= 500) {
        query.price = { $gte: priceVal };
      } else {
        query.price = { $lte: priceVal };
      }
    }

    const matchedAds = await Ads.find(query);

    if (matchedAds.length === 0) {
      return res
        .status(200)
        .json(
          successResponse(
            username,
            `Sorry ${username}, no ads found matching the provided criteria.`,
            null
          )
        );
    }

    return res
      .status(200)
      .json(
        successResponse(
          username,
          `Hey ${username}, your Ads retrieved successfully!.`,
          matchedAds
        )
      );
  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({
      message: "Server error while searching ads.",
      error: error.message,
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////
//
//ADING AN ADD - VENDOR
const addAdVendor = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    const role = req.user.role;
    const username = req.user.username;
    const userID = req.user.userID;
    if (role !== "vendor") {
      const message = errorResponse(
        username,
        `Hey ${username}, please login as a vendor to access this route.`,
        null,
        true
      );
      return res.status(401).json(message);
    }
    //validating fields with JOI

    const { value, error } = addAdSchema.validate(req.body);
    if (error) {
      const message = errorResponse(
        username,
        error.details[0].message,
        value,
        error.details[0]
      );
      return res.status(400).json(message);
    }

    //Generating new Ad ID
    const adID = uuidv4();

    //checking if there's A file
    const file = req.file;
    let imageMetada = {};
    if (file) {
      // uploading file to cloudinary
      const response = await cloudinary.uploader.upload(file.path);
      imageMetada = {
        userID,
        adID,
        public_id: response.public_id,
        url: response.secure_url,
        name: response.original_filename,
      };
      //Adding image metadata to DB
      await Images.create(imageMetada);
      //deleting image from fs
      await fs.unlink(req.file.path);
    }

    // creating a new Ad
    const newAd = {
      adID,
      userID,
      title,
      description,
      category,
      price,
      imageURL:
        imageMetada.url ??
        "https://ih1.redbubble.net/image.4905811472.8675/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
    };
    //Adding new Ad to DB
    await Ads.create(newAd);

    //sending new ad to client
    const message = successResponse(
      username,
      `Hey ${username}, your Ad was Updated successfully!.`,
      newAd
    );
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
  }
};
//
//
//
//UPDATING AN ADD - VENDOR
const updateAdVendor = async (req, res) => {
  try {
    const allNewAd = req.body;

    const role = req.user.role;
    const username = req.user.username;
    const userID = req.user.userID;
    if (role !== "vendor") {
      const message = errorResponse(
        username,
        `Hey ${username}, please login as a vendor to access this route.`,
        null,
        true
      );
      return res.status(401).json(message);
    }
    // //getting a single ad from DB
    const adID = req.params.adID;
    const matchedAd = await Ads.findOne({ adID, userID }, { __id: 0, __v: 0 });
    if (!matchedAd) {
      const message = successResponse(
        username,
        `Sorry ${username}, there's no ad matching the id - ${adID}.`,
        null
      );
      return res.status(200).json(message);
    }
    //checking if there's A file
    const file = req.file;
    let imageMetada = {};
    if (file) {
      // uploading file to cloudinary
      const response = await cloudinary.uploader.upload(file.path);
      imageMetada = {
        userID,
        adID,
        public_id: response.public_id,
        url: response.secure_url,
        name: response.original_filename,
      };
      //checking if image metadata exists
      const matchedImage = await Images.findOne({ userID, adID });
      if (!matchedImage) {
        await Images.create(imageMetada);
      }
      //updating Image metadata
      await Images.updateOne(
        { userID, adID },
        {
          $set: {
            imageURL: response.secure_url,
            public_id: response.public_id,
            name: response.original_filename,
          },
        }
      );
      //deteting image from cloudinary
      await cloudinary.uploader.destroy(matchedImage.public_id);
      //deleting image from fs
      await fs.unlink(req.file.path);
    }
    // creating a new Ad
    const newAd = {
      adID,
      userID,
      title: allNewAd.title ?? matchedAd.title,
      description: allNewAd.description ?? matchedAd.description,
      category: allNewAd.category ?? matchedAd.category,
      price: allNewAd.price ?? matchedAd.price,
      imageURL: imageMetada.url ?? matchedAd.imageURL,
    };
    const response = await Ads.updateOne(
      { userID, adID },
      { $set: { ...newAd } }
    );

    //sending new ad to client
    const message = successResponse(
      username,
      `Hey ${username}, your Ad was Updated successfully!.`,
      response
    );
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
  }
};

//
//
//DELETING AN ADD - VENDOR
const deleteAdVendor = async (req, res) => {
  try {
    const role = req.user.role;
    const username = req.user.username;
    const userID = req.user.userID;
    if (role !== "vendor") {
      const message = errorResponse(
        username,
        `Hey ${username}, please login as a vendor to access this route.`,
        null,
        true
      );
      return res.status(401).json(message);
    }
    //getting a single ad from DB
    const adID = req.params.adID;
    const matchedAd = await Ads.findOne({ adID, userID }, { __id: 0, __v: 0 });
    if (!matchedAd) {
      const message = successResponse(
        username,
        `Sorry ${username}, there's no ad matching the id - ${adID}.`,
        null
      );
      return res.status(200).json(message);
    }
    //deleting ad from DB
    const response = await Ads.deleteOne({ adID, userID });
    //getting image metadata
    const matchedImage = await Images.findOne({ userID, adID });
    if (matchedImage) {
      //deleting image from Cloudinary
      await cloudinary.uploader.destroy(matchedImage.public_id);
      //deleting image metadata
      await Images.deleteOne({ adID, userID });
    }
    //sending response to client
    const message = successResponse(
      username,
      `Hey ${username}, your Ad was Deleted successfully!.`,
      response
    );
    return res.status(200).json(message);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllAdVendor,
  getSingleAdVendor,
  searchAdsVendor,
  updateAdVendor,
  deleteAdVendor,
  addAdVendor,
};
