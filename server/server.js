require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT;
const authRouter = require("./routes/authRoutes");
const productRoute = require("./routes/productRoutes");
const addressRoute = require("./routes/addressRoutes");

///middleware
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/products", productRoute);
app.use("/api/address", addressRoute);
app.listen(PORT, () => console.log(`server on ports ${5000}`));
