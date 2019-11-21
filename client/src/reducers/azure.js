import { addReducer } from "reactn";
import axios from "axios";

/*
 *   @desc - Upload user image to azure api endpoint /persongroups/{personGroupId}/persons/{personId}/persistedFaces[?userData][&targetFace]
 */
addReducer("azureUploadUserImage", async (global, dispatch, {userId, imageId,personGroupId, personGroupPersonId}) => {
  try {
    const config = {
      headers: {
        "Content-Type": "Application/json"
      }
    };
    const body = JSON.stringify({
      userId: userId,
      personGroupId: personGroupId,
      personGroupPersonId: personGroupPersonId,
      imageId: imageId
    });

    const res = await axios.post("/api/azure/face", body, config);

    if(res)
        dispatch.createAlert({
            title: res.data.statusCode,
            description: res.data.msg,
            type: "success"
          });

    
    
  } catch (err) {
    const { errors } = err.response.data;
    if (errors)
      errors.map(error =>
        dispatch.createAlert({
          title: error.code.toString(),
          description: error.msg,
          id: "azure",
          type: "error"
        })
      );
    else {
      dispatch.createAlert({
        title: "UNKNOWN_ERR",
        description: "unknown error response from our API",
        id: "azure",
        type: "error"
      })
    }
  }
});
