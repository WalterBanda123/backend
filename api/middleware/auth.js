const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.ENV_SECRET_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({
        errorMessage: "Auth failed"
    })
  }
};
