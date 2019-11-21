const can = (...allowed) => {
  const isAllowed = role => allowed.indexOf(role) > -1;

  // return a middleware
  return (req, res, next) => {
    const { user } = req;
    if (user && isAllowed(user.role)) next();
    // role is allowed, so continue on the next middleware
    else {
      res.status(403).json([{ statusCode: "403", msg: "Forbidden" }]); // user is forbidden
    }
  };
};

module.exports = can;
