const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

//register a user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Validation
    if (!username || !email || !password) {
      return res.status(401).json({ error: "Missing fields" });
    }

    // if user exists
    const user = await User.findByUsername(username);
    if (user)
      return res.status(401).json({
        success: false,
        message: "UserName Already exists. Please try again",
      });

    // if email exists
    const checkEmail = await User.findByEmail(email);
    if (checkEmail)
      return res.status(401).json({
        success: false,
        message: "Email Already exists. Please try again",
      });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //Create user (pure DB operation)
    const newUser = await User.create({
      username,
      email,
      password: hash,
      role: "user", // Default role
    });

    //Respond
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // if user exists
    const user = await User.findByUsername(username);
    if (!user)
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });

    const checkPasswordMatch = await bcrypt.compare(password, user.password);
    if (!checkPasswordMatch)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        samesite: "strict",
      })
      //  secure: process.env.NODE_ENV === 'production', // Should be true in prod
      .json({
        success: true,
        message: "Logged in successfully",
        token,
        user: {
          role: user.role,
          id: user.id,
          userName: user.username,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
};

///logout
const logout = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out succesfully",
  });
};

////middleware to check auth status if user does an action and keep user logged in
const authMiddleware = async (req, res, next) => {
  // Try to get token from either cookies or Authorization header
  const token =
    req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Flexible ID checking (supports both 'id' and 'userId')
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      throw new Error("Invalid token payload");
    }

    req.user = {
      id: userId, // Standardized property name
      username: decoded.username, // Add other needed properties
      role: decoded.role,
    };

    return next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    // Clear cookie if exists
    if (req.cookies?.token) {
      res.clearCookie("token");
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid authentication",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  authMiddleware,
};
