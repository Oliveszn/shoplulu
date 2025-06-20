const jwt = require("jsonwebtoken");
// to make sure users not admin cant aceess the addproducts even if they tried

const checkAdmin = (req, res, next) => {
  try {
    // console.log("=== checkAdmin middleware called ===");
    // console.log("Headers:", req.headers);
    // console.log("Cookies:", req.cookies);
    // // Get token from multiple possible sources
    // const token =
    //   req.cookies.token ||
    //   req.headers.authorization?.split(" ")[1] ||
    //   req.headers["x-access-token"];
    // console.log("Extracted token:", token ? "TOKEN_EXISTS" : "NO_TOKEN");

    // if (!token) {
    //   console.log("No token found");
    //   return res.status(403).json({ error: "Access denied" });
    // }

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded); // Debug log

    // if (decoded.role !== "admin") {
    //   console.log("User role:", decoded.role);
    //   return res.status(403).json({ error: "Admin access required" });
    // }

    // req.user = decoded;
    if (!req.user) {
      return res.status(403).json({ error: "Authentication required" });
    }

    if (req.user.role !== "admin") {
      console.log("User role:", req.user.role);
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { checkAdmin };
