import express from "express";
import session from "express-session";
import morgan from "morgan";
import { localsMiddlewaer } from "./middleware";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import MongoStore from "connect-mongo";

const app = express();
const logger = morgan("dev");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.DB_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);
app.use(localsMiddlewaer);

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
