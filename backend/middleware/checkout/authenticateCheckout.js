const { verifyAccessToken } = require("../../utils/jwt");

const authenticateCheckout = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    req.userId = null;
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.id;
    next();
  } catch (err) {
    req.userId = null; 
    next();
  }
};

module.exports = authenticateCheckout;