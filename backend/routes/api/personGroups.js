const express = require("express");
const router = express.Router();
const axios = require("axios");

const Settings = require("../../models/Settings");
const PersonGroup = require("../../models/AzurePersonGroup");

const auth = require("../../middleware/auth");
const can = require("../../middleware/permission");
// Caching:
const groupsKey = "personGroups";
const personKeyPrefix = "person_";

const cacheManager = require("cache-manager");
const memoryCache = cacheManager.caching({
  store: "memory",
  max: 100,
  ttl: 15 /*seconds*/
});
const ttl = 5;

/* 
    @route      GET api/personGroups
    @desc       Get person group from azure & save to cache
    @access     private
*/
router.get("/", auth, can("admin"), async (req, res, next) => {
  const { apiKey, region } = await Settings.findOne({});
  const config = {
    headers: {
      "Content-Type": "Application/json",
      "Ocp-Apim-Subscription-Key": apiKey
    }
  };
  const url = `https://${region}.api.cognitive.microsoft.com/face/v1.0/persongroups`;
  try {
    let groups = await memoryCache.wrap(groupsKey, function() {
      return axios.get(url, config);
    });
    return res.json(groups.data);
  } catch (err) {
    next(err);
  }
});

/* 
    @route      PUT api/personGroups/:id
    @desc       Create new personGroup on MS azure + cache
    @access     private
*/
router.put("/:id", auth, can("admin"), async (req, res, next) => {
  const { apiKey, region } = await Settings.findOne({});
  const { name, userData } = req.body;
  const personGroupId = req.params.id;

  /*
   * try to create personGroup in azure, if successfull create add to cache
   */
  const config = {
    headers: {
      "Content-Type": "Application/json",
      "Ocp-Apim-Subscription-Key": apiKey
    }
  };
  const body = {
    personGroupId: personGroupId,
    name: name,
    userData: userData,
    recongitionModel: "recognition_02"
  };

  const url = `https://${region}.api.cognitive.microsoft.com/face/v1.0/persongroups/${personGroupId}`;
  try {
    await axios.put(url, body, config);

    /** Azure API called successfully - add to cache */
    const result = await memoryCache.get(groupsKey);
    let data = [];
    if (result) {
      //cache was found
      data = result.data;
      data.push(body);

      memoryCache.set(groupsKey, data);
    }
    return res.status(201).json({
      code: "PERSON_GROUP_CREATED",
      msg: "person group was successfully created",
      data: body
    });
  } catch (err) {
    next(err);
  }
});

/* 
    @route      DELETE api/personGroups/:id
    @desc       Delete person group from azure & cache
    @access     private
*/
router.delete("/:id", auth, can("admin"), async (req, res, next) => {
  const { apiKey, region } = await Settings.findOne({});
  const personGroupId = req.params.id;
  const config = {
    headers: {
      "Content-Type": "Application/json",
      "Ocp-Apim-Subscription-Key": apiKey
    }
  };
  const url = `https://${region}.api.cognitive.microsoft.com/face/v1.0/persongroups/${personGroupId}`;

  try {
    await axios.delete(url, config);
    /** Azure API delete called successfully - remove from cache */
    const result = await memoryCache.get(groupsKey);
    if (result) {
      console.log(result.data);
      //cache was found
      const data = result.data.filter(
        entry => entry.personGroupId != personGroupId
      );
      console.log(data);
      await memoryCache.set(groupsKey, data);
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/* 
    @route      GET api/personGroups/:personGroupId/persons
    @desc       Get persons of a person group
    @access     private
*/
router.get("/:id/persons", auth, can("admin"), async (req, res,next) => {
  const { apiKey, region } = await Settings.findOne({});
  const personGroupId = req.params.id;
  const cacheKey = personKeyPrefix + personGroupId;
  const config = {
    headers: {
      "Content-Type": "Application/json",
      "Ocp-Apim-Subscription-Key": apiKey
    }
  };
  const url = `https://${region}.api.cognitive.microsoft.com/face/v1.0/persongroups/${personGroupId}/persons`;
  try {
    const persons = await memoryCache.wrap(cacheKey, function() {
      return axios.get(url, config);
    });
    return res.json(persons.data);
  } catch (err) {
    next(err);
  }
});

/* 
    @route      GET api/personGroups/:personGroupId/persons/:personId
    @desc       Get specific person
    @access     private
*/
router.get(
  "/:groupId/persons/:personId",
  auth,
  can("admin"),
  async (req, res, next) => {
    const { apiKey, region } = await Settings.findOne({});
    const { groupId, personId } = req.params;
    const config = {
      headers: {
        "Content-Type": "Application/json",
        "Ocp-Apim-Subscription-Key": apiKey
      }
    };

    const url = `https://${region}.api.cognitive.microsoft.com/face/v1.0/persongroups/${groupId}/persons/${personId}`;

    try {
      const azureResponse = await axios.get(url, config);
      return res.json(azureResponse.data);
    } catch (err) {
      next(err);
    }
  }
);

/* 
    @route      POST api/personGroups/:personGroupId/persons
    @desc       Create new person on MS azure + cache
    @access     private
*/
router.post("/:groupId/persons", auth, can("admin"), async (req, res, next) => {
  const { apiKey, region } = await Settings.findOne({});
  const { name, userData } = req.body;
  const personGroupId = req.params.groupId;
  const cacheKey = personKeyPrefix + personGroupId;
  /*
   * try to create personGroup in azure, if successfull create add to cache
   */
  console.log(personGroupId);
  const config = {
    headers: {
      "Content-Type": "Application/json",
      "Ocp-Apim-Subscription-Key": apiKey
    }
  };
  const body = {
    name: name,
    userData: userData,
    recognitionModel: "recognition_02"
  };

  const url = `https://${region}.api.cognitive.microsoft.com/face/v1.0/persongroups/${personGroupId}/persons`;
  try {
    const personRes = await axios.post(url, body, config);

    /** Azure API called successfully - add to cache */
    const result = await memoryCache.get(cacheKey);
    const toPush = {
      ...body,
      personId: personRes.personId
    };
    let data = [];
    if (result) {
      //cache was found
      data = result.data;
      data.push(toPush);

      memoryCache.set(cacheKey, data);
    }
    return res.status(201).json({
      code: "PERSON_CREATED",
      msg: `person was successfully created in group ${personGroupId} `,
      data: toPush
    });
  } catch (err) {
    next(err);
  }
});


router.delete(
  "/:groupId/persons/:personId/persistedFaces/:faceId",
  auth,
  can("admin"),
  async (req, res, next) => {
    const { apiKey, region } = await Settings.findOne({});
    const { groupId, personId, faceId } = req.params;
    const config = {
      headers: {
        "Content-Type": "Application/json",
        "Ocp-Apim-Subscription-Key": apiKey
      }
    };
    const url = `https://${region}.api.cognitive.microsoft.com/face/v1.0/persongroups/${groupId}/persons/${personId}/persistedFaces/${faceId}`;
    try {
      await axios.delete(url, config);
      return res.status(200).send();
    } catch (err) {
      next(err);
    }
  });



/* 
    @route      DELETE api/personGroups/:groupId/persons/:personId
    @desc       Delete person group from azure & cache
    @access     private
*/
router.delete(
  "/:groupId/persons/:personId",
  auth,
  can("admin"),
  async (req, res, next) => {
    const { apiKey, region } = await Settings.findOne({});
    const groupId = req.params.groupId;
    const personId = req.params.personId;
    const cacheKey = personKeyPrefix + groupId;
    const config = {
      headers: {
        "Content-Type": "Application/json",
        "Ocp-Apim-Subscription-Key": apiKey
      }
    };
    const url = `https://${region}.api.cognitive.microsoft.com/face/v1.0/persongroups/${groupId}/persons/${personId}`;

    try {
      await axios.delete(url, config);
      /** Azure API delete called successfully - remove from cache */
      const result = await memoryCache.get(cacheKey);
      if (result) {
        console.log(result.data);
        //cache was found
        const data = result.data.filter(entry => entry.personId != personId);
        console.log(data);
        await memoryCache.set(cacheKey, data);
      }

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);









module.exports = router;
