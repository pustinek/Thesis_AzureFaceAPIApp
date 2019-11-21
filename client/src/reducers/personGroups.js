import axios from "axios";
import { addReducer } from "reactn";
import responseToError from "../utils/responseToError";

/*
 * GROUP reducers:
 * - delete group
 * - create group
 * - get groups
 * - get persons asigned to groups
 * - train group
*/

addReducer("deletePersonGroup", async (global, dispatch, personGroupId) => {
  try {
    const res = await axios.delete(`/api/personGroups/${personGroupId}`);

    dispatch.createAlert({
      title: "SUCCESS",
      description: `successfully deleted person group - ${personGroupId}`,
      type: "success",
      id: "personGroups"
    });
    /** Add group to global store */
    return {
      personGroups: global.personGroups.filter(
        grp => grp.personGroupId != personGroupId
      )
    };
  } catch (err) {
    const { errors } = err.response.data;
    console.error(err);
    if (errors)
      errors.map(error =>
        dispatch.createAlert({
          title: error.code.toString(),
          description: error.msg,
          id: "personGroups",
          type: "error"
        })
      );
  }
});
/*  
    @desc       Create person group on MS Azure + add to backend cache
*/
addReducer("createPersonGroup", async (global, dispatch, group) => {
  const { personGroupId } = group;
  console.log(group);

  try {
    const res = await axios.put(`/api/personGroups/${personGroupId}`, group);

    dispatch.createAlert({
      title: "SUCCESS",
      description: `successfully created person groups`,
      type: "success",
      id: "personGroups"
    });
    /** Add group to global store */
    return {
      personGroups: [
        ...global.personGroups,
        {
          personGroupId: personGroupId,
          name: group.name,
          userData: group.userData
        }
      ]
    };
  } catch (err) {
    const { errors } = err.response.data;
    console.error(err);
    if (errors)
      errors.map(error =>
        dispatch.createAlert({
          title: error.code.toString(),
          description: error.msg,
          id: "personGroups",
          type: "error"
        })
      );
  }
});

/*  
    @desc       Retrieve only person groups (-person) from backend (cache or azure)
    @point      groups
*/
addReducer("getPersonGroups", async (global, dispatch) => {
  try {
    const res = await axios.get("/api/personGroups");

    dispatch.createAlert({
      title: "SUCCESS",
      description: `successfully retrieved ${res.data.length} person groups`,
      type: "success",
      id: "personGroups"
    });

    return {
      personGroups: res.data
    };
  } catch (err) {
    const { errors } = err.response.data;
    if (errors)
      errors.map(error =>
        dispatch.createAlert({
          title: error.code.toString(),
          description: error.msg,
          id: "personGroups",
          type: "error"
        })
      );
    else
      dispatch.createAlert({
        title: "500",
        description: "unknown server error",
        id: "personGroups",
        type: "error"
      })
  }
});

/*  
    @desc       Get persons from a specified group
    @point      Persons
*/
addReducer("getPersonGroupsPersons", async (global, dispatch, groupId) => {
  try {
    const res = await axios.get(`/api/personGroups/${groupId}/persons`);
    console.log(res.data);

    return {
      personGroups: global.personGroups.map(grp => {
        if(grp.personGroupId == groupId) {
          grp.persons = res.data
        }
        return grp;
      })      
    }


  } catch (err) {
    const { errors } = err.response.data;
    if (errors)
      errors.map(error =>
        dispatch.createAlert({
          title: error.code.toString(),
          description: error.msg,
          id: "personGroups",
          type: "error"
        })
      );
  }
});

/*  
    @desc       Get single person from group
    @point      Persons
*/
addReducer("getPersonGroupPerson", async(global, dispatch, groupId, personId) => {
  try {
    const res = await axios.get(`/api/personGroups/${groupId}/persons/${personId}`);
    console.log(res.data);
    return {
      user: {
        ...global.user,
        azure: {
          ...global.user.azure,
          persistedFaceIds: res.data.persistedFaceIds
        }
      }
    }

  } catch (err) {
    responseToError(dispatch,err,"personGroupsPerson")
  }

});


addReducer("trainPersonGroups", async (global, dispatch, groupId) => {
    const {apiKey, region} = global.settings;

    try {
      const config = {
        headers: {
          "Content-Type": "Application/json",
          "Ocp-Apim-Subscription-Key": apiKey
        }
      };
      const url = `https://${region}.api.cognitive.microsoft.com/face/v1.0/persongroups/${groupId}/train`;
    

      await axios.post(url, null, config);

      dispatch.createAlert({
        title: "SUCCESS",
        description: `successfully triggered TRAIN for ${groupId}`,
        type: "success",
        id: "personGroups"
      });


    } catch (err) {
      const errRes = err.response;
      if (errRes) {
        dispatch.createAlert({
          title: `error - ${errRes.data.error.code}`,
          description: errRes.data.error.message,
          type: "error",
          id: "personGroups"
        });
      }
        
    }
});