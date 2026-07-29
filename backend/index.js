require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/task.routes");

const app = express();

const PORT = process.env.PORT || 8082;
const DB_URI = process.env.MONGO_URI;

mongoose
  .connect(DB_URI)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log("Error connecting to DB:", err));

app.use(cors());
app.use(express.json());
app.use("/tasks", taskRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Backend listening on Port ${PORT}!`);
});