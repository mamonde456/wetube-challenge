import express from "express";

const app = express();
const PORT = 4000;
app.listen(PORT,()=> `http://localhost:${PORT} 🚀`)

app.get("/",(req,res)=> res.send("<h1>Home</h1>"))
app.get("/about",(req,res)=> res.send("<h1>About</h1>"))
app.get("/contact",(req,res)=> res.send("<h1>Contact</h1>"))
app.get("/pp",(req,res)=> res.send("<h1>pp</h1>"))