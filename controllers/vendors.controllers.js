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
        `Sorry ${username}, You have no ads to be displayed.`,
        null
      );
      return res.status(200).json(message);
    }
    //sending ads to client
    const message = successResponse(
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
        `Sorry ${username}, there's no ad matching the id - ${adID}.`,
        null
      );
      return res.status(200).json(message);
    }
    //sending ads to client
    const message = successResponse(
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
//SEARCHING FOR AN AD - VENDOR
const searchAdsVendor = async (req, res) => {
  try {
    const role = req.user.role;
    const username = req.user.username;
    const userID = req.user.userID;
    if (role !== "vendor") {
      const message = errorResponse(
        `Hey ${username}, please login as a vendor to access this route.`,
        null,
        true
      );
      return res.status(401).json(message);
    }
    // getting all from querys
    const queryTitle = req.query.title;
    const queryCategory = req.query.category;
    const queryPrice = req.query.price;
    // finding ads by title
    if (queryTitle) {
      queryTitle.trim();
      const matchedAds = await Ads.find({
        title: { $regex: queryTitle, $options: "i" }, //REGULAR EXPRESSION ("i"-case incensitive)
        userID: userID,
      });
      //if no ads are found
      if (matchedAds.length === 0) {
        const message = successResponse(
          `Sorry ${username}, you don't have an ad matching the title ${queryTitle}.`,
          null
        );
        return res.status(200).json(message);
      }
      //sending ads to client
      const message = successResponse(
        `Hey ${username}, your Ads retrieved successfully!.`,
        matchedAds
      );
      return res.status(200).json(message);
    }
    //
    // filtering ads by category
    if (queryCategory) {
      queryCategory.trim();
      const matchedAds = await Ads.find({
        category: { $in: [queryCategory] },
        userID: userID,
      });
      //if no ads are found
      if (matchedAds.length === 0) {
        const message = successResponse(
          `Sorry ${username}, you don't have an ad matching the category ${queryCategory}.`,
          null
        );
        return res.status(200).json(message);
      }
      //sending ads to client
      const message = successResponse(
        `Hey ${username}, your Ads retrieved successfully!.`,
        matchedAds
      );
      return res.status(200).json(message);
    }
    //
    // filtering ads by price
    if (queryPrice < 1000) {
      const matchedAds = await Ads.find({
        price: { $lte: queryPrice },
        userID: userID,
      });
      //if no ads are found
      if (matchedAds.length === 0) {
        const message = successResponse(
          `Sorry ${username}, you don't have an ad less than ${queryPrice}GHC.`,
          null
        );
        return res.status(200).json(message);
      }
      //sending ads to client
      const message = successResponse(
        `Hey ${username}, your Ads retrieved successfully!.`,
        matchedAds
      );
      return res.status(200).json(message);
    }
    //IF the price exceeds 1000
    else if (queryPrice >= 1000) {
      const matchedAds = await Ads.find({
        price: { $gte: queryPrice },
        userID: userID,
      });
      //if no ads are found
      if (matchedAds.length === 0) {
        const message = successResponse(
          `Sorry ${username},you don't have an  ad greater than ${queryPrice}GHC.`,
          null
        );
        return res.status(200).json(message);
      }
      //sending ads to client
      const message = successResponse(
        `Hey ${username}, your Ads retrieved successfully!.`,
        matchedAds
      );
      return res.status(200).json(message);
    }
  } catch (error) {
    console.log(error.message);
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
      imageURL:
        imageMetada.url ??
        "https://ih1.redbubble.net/image.4905811472.8675/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
    };
    const response = await Ads.updateOne(
      { userID, adID },
      { $set: { ...newAd } }
    );

    //sending new ad to client
    const message = successResponse(
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
