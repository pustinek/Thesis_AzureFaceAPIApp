import axios from "axios";
import { addReducer } from "reactn";
/*
  Reducers for user images that they upload
  Features: delete image, upload images, get images...
*/

/*
    @desc Delete specified user image
*/
addReducer("deleteUserImage", async (global, dispatch, { userId, imageId }) => {
  try {
    const res = await axios.delete(`/api/images/${userId}/${imageId}`);
   
    if(res != null)
        dispatch.createAlert({
            title: 200,
            description: `Successfully deleted image ${imageId}`,
            type: "success"
        });

    if (global.auth.user._id === userId) {
      //same user so change the auth part of global
      return {
        auth: {
          ...global.auth,
          user: {
            ...global.auth.user,
            images: res.data.images
          }
        }
          
      };
    } else {
      // different user, change the user part of global
      return {
        user: {
          ...global.user,
          images: global.user.images.filter(img => img._id !== imageId)
        }
      };
    }
  } catch (err) {
    console.log(err.response);
  }
});

/*
    @desc upload images uploaded by user. Images are linked to the user that is currently logged in.
*/
addReducer("uploadUserImages", async (global, dispatch, formData) => {
  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const res = await axios.post("/api/images", formData, config);


    const {errors, payload} = res.data;


    if (errors) 
        errors.map(error =>
            dispatch.createAlert({
                title: error.status,
                description: error.msg,
                type: "error"
            })
        );
    if(payload)
        return {
            auth: {
            ...global.auth,
            user: {
                ...global.auth.user,
                images: payload
            }
            }
        };

  } catch (err) {
    console.log(err.response);
    const res = err.response;
    const {errors} = res.data;
    if(errors)
        errors.map(error =>  dispatch.createAlert({
            title: error.status,
            description: error.msg,
            type: "error"
          }));
  }
});

/*
 *   @Desc: get user images, to display
 *   @Param userId : id of user, for which you want the images
 */
addReducer("getUserImages", async (global, dispatch, userId) => {
  try {
    const res = await axios.get(`/api/images/${userId}`, {
      responseType: "api/json"
    });
    const { payload, errors } = res.data;

    if (errors) 
      errors.map(error =>
        dispatch.createAlert({
          title: error.status,
          description: error.msg,
          type: "error"
        })
      );
    dispatch.createAlert({
        title: 200,
        description: `Successfully retrieved ${payload.length} images`,
        type: "success"
    });
    return {
      user: {
        ...global.user,
        images: payload
      }
    };
  } catch (err) {
    console.log(err);
    const res = err.response;
    const {errors} = res.data;
    if(errors)
        errors.map(error =>  dispatch.createAlert({
            title: error.status,
            description: error.msg,
            type: "error"
          }));

   
  }
});
