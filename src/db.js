//127.0.0.1:27017

import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube-challenge", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleError = (error) =>
  console.log(`❌ Error on DB Connection: ${error}`);
const handleOpen = () => console.log("✅ Connected to db!🚀");

db.on("error", handleError);
db.once("open", handleOpen);
