const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const axios = require("axios");
const { check, validationResult } = require("express-validator/check");
const fs = require("fs");
const url = require("url");

const auth = require("../../middleware/auth");
const can = require("../../middleware/permission");
const UserModel = require("../../models/User");
const Settings = require("../../models/Settings");

/* 
    @route      POST api/azure/face
    @desc       Upload user face/image to azure
    @access     private
*/
router.post("/face", async (req, res) => {
  const { userId, personGroupId, personGroupPersonId, imageId } = req.body;

  console.log(req.body);

  if (!userId)
    return res.status(404).json({ statusCode: 404, msg: "userId is required" });
  if (!personGroupId)
    return res
      .status(404)
      .json({ statusCode: 404, msg: "personGroupId is required" });
  if (!personGroupPersonId)
    return res
      .status(404)
      .json({ statusCode: 404, msg: "personGroupPersonId is required" });
  if (!imageId)
    return res
      .status(404)
      .json({ statusCode: 404, msg: "imageId is required" });

  try {
    const { apiKey, region } = await Settings.findOne({});
    console.log("/face api called")
    const azureUrl = `https://${region}.api.cognitive.microsoft.com/face/v1.0/persongroups/${personGroupId}/persons/${personGroupPersonId}/persistedFaces`;

    const images = await User.findById({ _id: userId }).select("images");
    const image = images.images.find(img => img._id == imageId);

    if (!image) {
      return res.status(404).json({
        errors: [
          {
            code: "NO_IMAGE_FOUND",
            msg: "No image was found"
          }
        ]
      });
    }
    if (image.azure.uploadDate != null && image.azure.personGroupPersonId == personGroupPersonId) {
      return res.status(500).json({
        errors: [
          {
            code: "ALREADY_UPLOADED",
            msg: "Image was already uploaded"
          }
        ]
      });
    }

    try {
      fs.readFile(
        `uploads/${userId}/${image.fileName}`,
        async (err, content) => {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ statusCode: 500, msg: err.message });
          }
          const config = {
            headers: {
              "Content-Type": "Application/octet-stream",
              "Ocp-Apim-Subscription-Key": apiKey
            }
          };

          try {
            const azureResponse = await axios.post(azureUrl, content, config);
            const { persistedFaceId } = azureResponse.data;

            const imageData = {
              personGroupId: personGroupId,
              personGroupPersonId: personGroupPersonId,
              uploadDate: Date.now(),
              persistedFaceId: persistedFaceId //supplied by azure on upload
            };

            const user = await User.findOneAndUpdate(
              { _id: userId },
              {
                $set: {
                  "images.$[elem].azure": imageData
                }
              },
              {
                arrayFilters: [{ "elem._id": imageId }]
              }
            );

            if (user != null) {
              return res.json({
                statusCode: 200,
                msg: "Successfully uploaded image"
              });
            }
          } catch (err) {
            const errRes = err.response;
            console.log(err.response);
            if (errRes)
              return res.status(errRes.status).json({
                errors: [
                  {
                    code: errRes.data.error.code,
                    msg: errRes.data.error.message
                  }
                ]
              });
            else
              return res.status(500).json({
                errors: [
                  {
                    code: "AZURE_UNKNOWN_ERROR",
                    msg: "unkown error occured calling azure API"
                  }
                ]
              });
          }
        }
      );
    } catch (err) {
      console.log(err.message);
    }
  } catch (err) {
    console.error(err.message);
  }
});


/* 
    @route      DELETE api/azure/face
    @desc       Delete user face/image from azure
    @access     private
*/
router.delete("/face", async (req, res, ) => {
  

});



module.exports = router;
