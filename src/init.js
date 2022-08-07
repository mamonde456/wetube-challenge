import "regenerator-runtime";
import "dotenv/config";
import "./db.js";
import "./models/Video.js";
import "./models/User.js";
import "./models/Comment.js";
import app from "./server.js";

const handleListening = () =>
  console.log(
    `✅ Server listenting on http://localhost:${process.env.PORT || 4000} 🚀`
  );

app.listen(process.env.PORT || 4000, handleListening);
