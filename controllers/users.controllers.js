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
const searchAdsUSer = async (req, res) => {
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
    // getting all from querys
    const queryTitle = req.query.title;
    const queryCategory = req.query.category;
    const queryPrice = req.query.price;
    /////////////////////////////////////////////
    // if theres title category and price

    if (queryTitle && queryCategory && queryPrice) {
      queryTitle.trim();

      // filtering ads by price
      if (queryPrice < 500) {
        const matchedAds = await Ads.find({
          title: { $regex: queryTitle, $options: "i" },
          category: { $in: [queryCategory] },
          price: { $lte: queryPrice },
        });
        //if no ads are found
        if (matchedAds.length === 0) {
          const message = successResponse(
            username,
            `Sorry ${username}, there's no ad less than ${queryPrice}GHC with title ${queryTitle} in ${queryCategory} category.`,
            null
          );
          return res.status(200).json(message);
        }
        //sending ads to client
        const message = successResponse(
          `Ads retrieved successfully!.`,
          matchedAds
        );
        return res.status(200).json(message);
      }
      //IF the price exceeds 1000
      else if (queryPrice >= 500) {
        const matchedAds = await Ads.find({
          price: { $gte: queryPrice },
          title: { $regex: queryTitle, $options: "i" },
          category: { $in: [queryCategory] },
        });
        //if no ads are found
        if (matchedAds.length === 0) {
          const message = successResponse(
            username,
            `Sorry ${username}, there's no ad greater than ${queryPrice}GHC with title ${queryTitle} in ${queryCategory} category.`,
            null
          );
          return res.status(200).json(message);
        }
        //sending ads to client
        const message = successResponse(
          username,
          `Ads retrieved successfully!.`,
          matchedAds
        );
        return res.status(200).json(message);
      }
    }
    ////////////////////////////////////////////
    // if theres title and category
    if (queryTitle && queryCategory) {
      queryTitle.trim();
      const matchedAds = await Ads.find({
        title: { $regex: queryTitle, $options: "i" },
        category: { $in: [queryCategory] },
      });
      //if no ads are found
      if (matchedAds.length === 0) {
        const message = successResponse(
          username,
          `Sorry ${username}, there's no ad matching the title ${queryTitle}, in ${queryCategory} category..`,
          null
        );
        return res.status(200).json(message);
      }
      //sending ads to client
      const message = successResponse(
        username,
        `Ads retrieved successfully!.`,
        matchedAds
      );
      return res.status(200).json(message);
    }

    ////////////////////////////////////////////
    // if theres title and price
    if (queryTitle && price) {
      queryTitle.trim();
      // filtering ads by price
      if (queryPrice < 500) {
        const matchedAds = await Ads.find({
          title: { $regex: queryTitle, $options: "i" },
          price: { $lte: queryPrice },
        });
        //if no ads are found
        if (matchedAds.length === 0) {
          const message = successResponse(
            username,
            `Sorry ${username}, there's no ad less than ${queryPrice}GHC with title ${queryTitle}.`,
            null
          );
          return res.status(200).json(message);
        }
        //sending ads to client
        const message = successResponse(
          username,
          `Ads retrieved successfully!.`,
          matchedAds
        );
        return res.status(200).json(message);
      }
      //IF the price exceeds 1000
      else if (queryPrice >= 500) {
        const matchedAds = await Ads.find({
          price: { $gte: queryPrice },
          title: { $regex: queryTitle, $options: "i" },
        });
        //if no ads are found
        if (matchedAds.length === 0) {
          const message = successResponse(
            username,
            `Sorry ${username}, there's no ad greater than ${queryPrice}GHC with title ${queryTitle}.`,
            null
          );
          return res.status(200).json(message);
        }
        //sending ads to client
        const message = successResponse(
          username,
          `Ads retrieved successfully!.`,
          matchedAds
        );
        return res.status(200).json(message);
      }
    }
    ////////////////////////////////////////////
    // if theres category and price
    if (queryCategory && queryPrice) {
      // filtering ads by price
      if (queryPrice < 500) {
        const matchedAds = await Ads.find({
          category: { $in: [queryCategory] },
          price: { $lte: queryPrice },
        });
        //if no ads are found
        if (matchedAds.length === 0) {
          const message = successResponse(
            username,
            `Sorry ${username}, there's no ad less than ${queryPrice}GHC in ${queryCategory} category.`,
            null
          );
          return res.status(200).json(message);
        }
        //sending ads to client
        const message = successResponse(
          username,
          `Ads retrieved successfully!.`,
          matchedAds
        );
        return res.status(200).json(message);
      }
      //IF the price exceeds 1000
      else if (queryPrice >= 500) {
        const matchedAds = await Ads.find({
          price: { $gte: queryPrice },
          category: { $in: [queryCategory] },
        });
        //if no ads are found
        if (matchedAds.length === 0) {
          const message = successResponse(
            username,
            `Sorry ${username}, there's no ad greater than ${queryPrice}GHC in ${queryCategory} category.`,
            null
          );
          return res.status(200).json(message);
        }
        //sending ads to client
        const message = successResponse(
          username,
          `Ads retrieved successfully!.`,
          matchedAds
        );
        return res.status(200).json(message);
      }
    }

    ////////////////////////////////////////////

    // finding ads by title
    if (queryTitle) {
      queryTitle.trim();
      const matchedAds = await Ads.find({
        title: { $regex: queryTitle, $options: "i" },
      });
      //if no ads are found
      if (matchedAds.length === 0) {
        const message = successResponse(
          username,
          `Sorry ${username}, there's no ad matching the title ${queryTitle}.`,
          null
        );
        return res.status(200).json(message);
      }
      //sending ads to client
      const message = successResponse(
        username,
        `Ads retrieved successfully!.`,
        matchedAds
      );
      return res.status(200).json(message);
    }
    //
    // filtering ads by category
    if (queryCategory) {
      queryCategory.trim();
      const matchedAds = await Ads.find({ category: { $in: [queryCategory] } });
      //if no ads are found
      if (matchedAds.length === 0) {
        const message = successResponse(
          username,
          `Sorry ${username}, there's no ad matching the category ${queryCategory}.`,
          null
        );
        return res.status(200).json(message);
      }
      //sending ads to client
      const message = successResponse(
        `Ads retrieved successfully!.`,
        matchedAds
      );
      return res.status(200).json(message);
    }
    //
    // filtering ads by price
    if (queryPrice < 1000) {
      const matchedAds = await Ads.find({ price: { $lte: queryPrice } });
      //if no ads are found
      if (matchedAds.length === 0) {
        const message = successResponse(
          username,
          `Sorry ${username}, there's no ad less than ${queryPrice}GHC.`,
          null
        );
        return res.status(200).json(message);
      }
      //sending ads to client
      const message = successResponse(
        username,
        `Ads retrieved successfully!.`,
        matchedAds
      );
      return res.status(200).json(message);
    }
    //IF the price exceeds 1000
    else if (queryPrice >= 1000) {
      const matchedAds = await Ads.find({ price: { $gte: queryPrice } });
      //if no ads are found
      if (matchedAds.length === 0) {
        const message = successResponse(
          username,
          `Sorry ${username}, there's no ad greater than ${queryPrice}GHC.`,
          null
        );
        return res.status(200).json(message);
      }
      //sending ads to client
      const message = successResponse(
        username,
        `Ads retrieved successfully!.`,
        matchedAds
      );
      return res.status(200).json(message);
    }
    // else send all adds
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

module.exports = { getAllAdUser, getSingleAdUSer, searchAdsUSer };
