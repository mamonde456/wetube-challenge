import User from "../models/User";
import bcrypt from "bcrypt";
import session from "express-session";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "created an account" });
};
export const postJoin = async (req, res) => {
  const {
    body: { username, name, password, password2, email },
  } = req;
  const userExists = await User.exists({ username });
  if (userExists) {
    return res.status(400).render("join", { errorMessage: "aleady username" });
  }
  if (password !== password2) {
    return res.status(400).render("join", { errorMessage: "wrong password" });
  }

  await User.create({
    username,
    name,
    password,
    email,
  });
  return res.redirect("/login");
};
export const getLogin = (req, res) => {
  res.render("login");
};
export const postLogin = async (req, res) => {
  const {
    body: { username, password },
  } = req;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", { errorMessage: "noting found." });
  }

  const ok = bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", { errorMessage: "wrong password" });
  }
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const edit = (req, res) => {
  res.send("edit");
};

export const deleteUser = (req, res) => {
  res.send("delete User");
};
