// the below require statement  is not consistant with imports
// require("dotenv").config();
// to resolve the above issue we use import and call the function
// but with this we have also changed the package.json file to accomodate it in the dev script
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    })
  })
  .catch((error) => console.log("MONGO DB connection failed: ", error));

/*
// approach 1 to develop a server

import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
const app = express();

// using iffy:immediately invoked function expression
(async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // check for errors
    app.on("error", (error) => {
      console.log("error occured:", error);
      throw error;
    });

    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    })
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // process.exit(1);
  }
})();
*/
