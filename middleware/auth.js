const jwt=require('jsonwebtoken')

exports.decodeToken = async (req, res, next) => {
  const token = req.headers.authorization?.trim().split(" ")[1];

  try {
    jwt.verify(token,"secretkey123", (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized Access" });
      }
      req.token = decodedToken;
      next();
    });
  } catch (err) {
    console.log(err);
  }
};
