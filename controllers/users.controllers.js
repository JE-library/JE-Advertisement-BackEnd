const Ads = require("../models/Ad");
const { param } = require("../routes/auth.routes");
const { errorResponse, successResponse } = require("../utils/response");

//GETTING ALL ADS - USER
const getAllAdUser = async (req, res) => {
  try {
    const role = req.user.role;
    const username = req.user.username;
    const userID = req.user.userID;
    if (role !== "user" && role !== "vendor") {
      const message = errorResponse(
        username,
        `Hey ${username}, please login to access this route.`,
        null,
        true
      );
      console.log(role);

      res.status(401).json(message);
    }
    //getting all ads from DB
    const ads = await Ads.find({}, { __id: 0, __v: 0 });
    if (ads.length === 0) {
      const message = successResponse(
        username,
        `Sorry ${username}, there's no ads to be displayed.`,
        null
      );
      return res.status(200).json(message);
    }
    //sending ads to client
    const message = successResponse(
      username,
      `Ads retrieved successfully!.`,
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
//GETTING A SINGLE AD - USER
const getSingleAdUSer = async (req, res) => {
  try {
    const role = req.user.role;
    const username = req.user.username;
    const userID = req.user.userID;
    if (role !== "user" && role !== "vendor") {
      const message = errorResponse(
        username,
        `Hey ${username}, please login to access this route.`,
        null,
        true
      );
      res.status(401).json(message);
    }
    //getting a single ad from DB
    const adID = req.params.adID;
    const matchedAd = await Ads.findOne({ adID }, { __id: 0, __v: 0 });
    console.log(matchedAd);

    if (!matchedAd) {
      const message = successResponse(
        username,
        `Sorry ${username}, there's no ads to be displayed.`,
        null
      );
      return res.status(200).json(message);
    }
    //sending ads to client
    const message = successResponse(
      username,
      `Ad retrieved successfully!.`,
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
//SEARCHING FOR AN AD
const searchAdsVendor = async (req, res) => {
  try {
    const role = req.user.role;
    const username = req.user.username;
    const userID = req.user.userID;

    if (role !== "vendor" && role !== "user") {
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

module.exports = { getAllAdUser, getSingleAdUSer, searchAdsUSer };
