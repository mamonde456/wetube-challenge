import User from "../models/User";
import bcrypt from "bcrypt";
import session from "express-session";
import fs from "fs";
import fetch from "cross-fetch";

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

export const userGithubStart = (req, res) => {
  const apiUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${apiUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const userGithubFinish = async (req, res) => {
  const code = req.query.code;
  const apiUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${apiUrl}?${params}`;

  const data = await (
    await fetch(finalUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in data) {
    const { access_token } = data;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const userEmailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const userEmailObj = await userEmailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!userEmailObj) {
      return res.redirect("/login");
    }
    const emailExists = await User.exists({ email: userEmailObj.email });
    if (emailExists) {
      req.session.loggedIn = true;
      req.session.user = emailExists;
      return res.redirect("/");
    } else {
      const user = await User.create({
        name: userData.name,
        username: userData.login,
        password: " ",
        email: userEmailObj.email,
        socialOnly: true,
        githubLogin: true,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};

export const getEditProfile = (req, res) => {
  return res.render("profile", { pageTitle: "edit profile" });
};
export const postEditProfile = (req, res) => {
  res.send("edit");
};

export const deleteUser = (req, res) => {
  res.send("delete User");
};
