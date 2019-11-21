const { promisify } = require("util");

const express = require("express");
const router = express.Router();

const fs = require("fs");
const axios = require("axios");
// Models
const User = require("../../models/User");
const Image = require("../../models/Image");
const Settings = require("../../models/Settings");
// Middleware
const multer = require("multer");
const auth = require("../../middleware/auth");
const can = require("../../middleware/permission");
// Promisify filesystem:
const unlinkFile = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

//function will check if a directory exists, and create it if it doesn't
const checkDirectory = (directory, callback) => {
  fs.stat(directory, function(err, stats) {
    //Check if error defined and the error code is "not exists"
    if (err && err.code == "ENOENT") {
      //Create the directory, call the callback.
      fs.mkdir(directory, callback);
    } else {
      //just in case there was a different error:
      callback(err);
    }
  });
};

/*
    MULTER OPTIONS
    --storage
*/
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    const { _id } = req.user;
    const pathUrl = `./uploads/${_id}`;
    checkDirectory(pathUrl, err => {
      if (err) {
        cb(new Error("Someting has gone wrong !"));
      } else {
        // Directory exists/Was created, carry on.
        cb(null, `./uploads/${_id}`);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

/*
    MULTER OPTIONS
    --file filter
*/
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(new Error("error occured"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 20 },
  fileFilter: fileFilter
});

/* 
    @route          POST /api/images
    @desc           Upload image to this webserver.
                    Image is saved under the uuid of the user saving it
    @access         Private
*/
router.post("/", auth, upload.array("userImages", 8), async (req, res) => {
  const { files } = req;
  const { _id } = req.user;
  console.log("post to images!!!!!!");
  const data = {
    errors: [],
    payload: []
  }

  for await (const file of files) {
    const originalName = file.originalname.split(".")[0];
    const fileExtension = file.originalname.split(".")[1];
    const { filename } = file;

    try {
      

      // Check our database if file already exists
      let user = await User.findOne({
        _id: _id,
        "images.originalName": originalName
      }).select({ "images.$": originalName });
      if (user) {
        // User exists, delete the file that was just uploaded !
        await unlinkFile(`./uploads/${_id}/${filename}`);
        data.errors.push({
          status: 409,
          msg: `image with name ${originalName} already exists in our database`
        });
        continue;
      }

      user = await User.findByIdAndUpdate(
        { _id: _id },
        {
          $push: {
            images: new Image({
              fileName: filename,
              originalName: originalName,
              fileExtension: fileExtension,
              azure: {
                personGroupId: null, 
                personGroupPersonId: null,
                uploadDate: null, 
                persistedFaceId: null
                
              }
            })
          }
        }
      );

      await user.save();
      continue;
    } catch (err) {
      console.error(err.message);
    }
  }
  const user = await User.findById(_id).select("images");

  data.payload = user.images;

  res.status(200).json(data);
});

/* 
    @route          DELETE /images/:userId/:imageId
    @desc           Delete an image from the server
    @access         Private
*/
router.delete("/:userId/:imageId", auth, async (req, res) => {
  try {
    const { userId, imageId } = req.params;

    let user = await User.findOne({
      _id: userId,
      "images._id": imageId
    }).select({ "images.$": imageId });
    if (!user) return res.status(404).json({ msg: "no image to delete" });
    
    const { fileName, azure } = user.images[0];
    // remove image from backend
    try{
      await unlinkFile(`./uploads/${userId}/${fileName}`);
    }catch(err){
      //DON't do anything
    }

    try {
      const { apiKey, region } = await Settings.findOne({});
      const config = {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey
        }
      };
      const url = `https://${region}.api.cognitive.microsoft.com/face/v1.0/persongroups/${azure.personGroupId}/persons/${azure.personGroupPersonId}/persistedFaces/${azure.persistedFaceId}`;
      const azureResponse = await axios.delete(url, config);
    } catch (err) {
      //console.log(err);
    }

    

    // remove image reference from user.images
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: { images: { _id: imageId } }
      }
    );

    user = await User.findById({ _id: userId }).select("-password");
    
    res.json(user);
  } catch (err) {
    //console.log(err);
    res.status(500).json({ msg: err.message });
  }
});

/* 
    @route          GET /images/:userId
    @desc           Get user images
    @access         Private
*/
router.get("/:userId", auth, can("admin"), async (req, res) => {
  
  const { userId } = req.params;
  const data = {
    errors: [],
    payload: []
  }
  try {
    const { images } = await User.findById({ _id: userId })
      .select("images")
      .lean(true);

    if(!images || images.length == 0){
        data.errors.push({status:404, msg: "no images were found for this user"});
        return res.status(404).json(data);
    }
    await Promise.all(
      images.map(async image => new Promise((resolve, reject) => {
        const {fileName} = image;
        fs.readFile(`uploads/${userId}/${fileName}`, "base64", (err, content) => {
          if (err) {
            data.errors.push({
              status: 400,
              msg: `failed to read file ${fileName}`,
            }
            );
            return resolve("error occured, but continue");
          }
        
          data.payload.push({
            ...image,
            content: content
          });
          resolve("read successfully");
        });
      }))
    );
      return res.json(data)
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
