import { addReducer } from "reactn";
import axios from "axios";

addReducer("getSettings", async (global,dispatch) => {
  try {
    const res = await axios.get("/api/settings");
    console.log(res.data);
    return {
      settings: {
        isLoading: false,
        apiKey: res.data.apiKey,
        region: res.data.region
      }
    };
  } catch (err) {
    console.log(err);
    const errors = err.response.data;
    if (errors)
    errors.map(error =>
        dispatch.createAlert({
            title: error.statusCode.toString(),
            description: error.msg,
            id: "settings",
            type: "error",
            
          })
    );
    return {
        settings: {
          isLoading: false,
          apiKey: "",
          region: ""
        }
      };
  }
});

addReducer("setSettings", async (global, dispatch, settings) => {
  try {
    const config = {
      headers: {
        "Content-Type": "Application/json"
      }
    };
    const body = JSON.stringify(settings);

    const res = await axios.post("/api/settings", body, config);
    dispatch.createAlert({
      title: "200",
      description: "Successfully updated settings",
      type: "success"
    })

    return {
      settings: {
        isLoading: false,
        apiKey: res.data.apiKey,
        region: res.data.region
      }
    };
  } catch (err) {

    const errors = err.response.data;
    if (errors)
    errors.map(error =>
        dispatch.createAlert({
            title: error.statusCode.toString(),
            description: error.msg,
            id: "settings",
            type: "error"
          })
    );
  }
});
