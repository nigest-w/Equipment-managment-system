module.exports = function (req, res, next) {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json("Admin Access Required");
    }

    next();

  } catch (error) {
    res.status(500).json("Server Error");
  }

};