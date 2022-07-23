import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleError = (error) =>
  console.log(`❌ Error on DB Connection: ${error}`);
const handleOpen = () => console.log("✅ Connected to db!🚀");

db.on("error", handleError);
db.once("open", handleOpen);
