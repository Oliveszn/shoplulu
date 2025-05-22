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
    const checkUser = await User.findByUsername(username);
    if (checkUser)
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
    const checkUser = await User.findByUsername(username);
    if (!checkUser)
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

    const token = jwt.sign(
      { id: checkUser._id, username: checkUser.username, role: checkUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
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
  const token = req.cookies.token;
  if (!token) {
    // Allow requests to proceed as unauthenticated
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.clearCookie("token");
      req.user = null;
      return next();
    }

    console.error("JWT verification failed:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  authMiddleware,
};
