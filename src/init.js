import "dotenv/config";
import "./db";
import "./models/User";
import "./models/Video";

import app from "./server";

const PORT = 4000;

const handleListenting = () =>
  console.log(`Server listenting to http://localhost:${PORT} 🚀`);
app.listen(PORT, handleListenting);
