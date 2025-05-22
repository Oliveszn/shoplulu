require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const authRouter = require("./routes/authRoutes");
const productRoute = require("./routes/productRoutes");

///middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/products", productRoute);
app.listen(PORT, () => console.log(`server on ports ${5000}`));
