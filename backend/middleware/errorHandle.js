module.exports = function handleError(err, req, res, next) {
  // Get token from the header
  const errRes = err.response;
  console.log(err.code)
  if(err.code && err.code == "ENOTFOUND") {
    return res.status(404).json({
        errors: [
          {
            code: err.code,
            msg: "called API endpoint doesn't exist"
          }
        ]
      });
  }

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
          code: "UNKNOWN_ERROR",
          msg: "unkown error occured calling azure API"
        }
      ]
    });
};
