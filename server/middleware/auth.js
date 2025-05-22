// to make sure users not admin cant aceess the addproducts even if they tried
const checkAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

module.exports = { checkAdmin };
