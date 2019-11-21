import axios from "axios";
import { addReducer } from "reactn";
import responseToError from "../utils/responseToError";

/*
 * PERSON reducers:
 * - create person
 * - delete person
 * - delete persistedFace
*/

addReducer("personGroupPersonCreate", async (global, dispatch, data) => {
  const { personGroupId, name, userData } = data;
  try {
    const res = await axios.post(`/api/personGroups/${personGroupId}/persons`, data);
    console.log(res);
    return {
      personGroups: global.personGroups.map(pg => {
        if (pg.personGroupId === personGroupId) {
          return {
            ...pg,
            people: [
              ...(pg.people ? pg.people : []),
              {
                personId: res.data.personId,
                name: name,
                userData: userData
              }
            ]
          };
        }
        return pg;
      })
    };
  } catch (err) {
    console.log(err);
    const { errors } = err.response.data;
    if (errors)
      errors.map(error =>
        dispatch.createAlert({
          title: error.code.toString(),
          description: error.msg,
          id: "personGroupsPerson",
          type: "error"
        })
      );
  }
});

addReducer(
  "personGroupPersonDelete",
  async (global, dispatch, personGroupId, personId) => {
    const url = `/api/personGroups/${personGroupId}/persons/${personId}`;
    try {
      await axios.delete(url);
      return {
        personGroups: global.personGroups.map(pg => {
          if (pg.personGroupId === personGroupId) {
            return {
              ...pg,
              persons: pg.persons.filter(person => person.personId !== personId)
            };
          }
          return pg;
        })
      };
    } catch (err) {
      const { errors } = err.response.data;
      if (errors)
        errors.map(error =>
          dispatch.createAlert({
            title: error.code.toString(),
            description: error.msg,
            id: "personGroupsPerson",
            type: "error"
          })
        );
    }
  }
);

addReducer("deletePersonPersistedFaceId", async(global, dispatch, groupId, personId, faceId) => {
  const url = `/api/personGroups/${groupId}/persons/${personId}/persistedFaces/${faceId}`;

  try {
    await axios.delete(url);
    return {
      user: {
        ...global.user,
        azure:{
          ...global.user.azure,
          persistedFaceIds: global.user.azure.persistedFaceIds.filter(face => face !== faceId)
        }
      }
    };

  } catch (err) {
    responseToError(dispatch,err,"personGroupPerson")
  }


});



