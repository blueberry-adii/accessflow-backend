const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middlewares/error.middleware");

const PORT = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(express.json());

app.use("/v1/api/auth", authRoutes);
app.get("/v1/api/health", (req, res) => {
  res.status(200).json({ status: "Ok", time: new Date().toISOString });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/v1/api/health`);
});
