const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const router = require("./route/router");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;


//Middleware
app.use(express.json());
app.use("/api", router);

//Connecting to database
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to database");
  } catch (error) {
    console.error("Database connection failed");
  }
}

function Apprunn() {
  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}

connectToDatabase();
Apprunn();