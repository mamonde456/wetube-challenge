import "regenerator-runtime";
import "dotenv/config";
import "./db.js";
import "./models/Video.js";
import "./models/User.js";
import "./models/Comment.js";
import app from "./server.js";

// const PORT = ;

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(process.env.PORT || 4000, handleListening);
