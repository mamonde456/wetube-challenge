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
  const userExists = await User.exists({ $or: [{ username }, { email }] });
  if (userExists) {
    return res
      .status(400)
      .render("join", { errorMessage: "aleady username/email" });
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
  res.render("login", { pageTitle: "Log In" });
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

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const profile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  return res.render("profile", { pageTitle: user.name, user });
};

export const getEditProfile = (req, res) => {
  return res.render("edit-profile", { pageTitle: "edit profile" });
};
export const postEditProfile = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, username, email },
    file,
  } = req;

  if (req.session.user.username !== username) {
    const exists = await User.exists({ username });
    if (exists) {
      return res.status(400).render("edit-profile", {
        pageTitle: "Edit profile",
        errorMessage: "User name already exists.",
      });
    }
  }

  if (req.session.user.email !== email) {
    const exists = await User.exists({ email });
    if (exists) {
      return res.status(400).render("edit-profile", {
        pageTitle: "Edit profile",
        errorMessage: "User email already exists.",
      });
    }
  }

  const newUser = await User.findOneAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      username,
      email,
    },
    { new: true }
  );
  req.session.user = newUser;
  return res.redirect("/");
};

export const getPassword = (req, res) => {
  return res.render("change-password", { pageTitle: "change password" });
};
export const postPassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("change-password", {
      pageTitle: "change password",
      errorMessage: "Existing passwords do not match.",
    });
  }
  if (newPassword !== newPassword2) {
    return res.status(400).render("change-password", {
      pageTitle: "change password",
      errorMessage: "The new password and password confirmation do not match.",
    });
  }

  user.password = newPassword;
  await user.save();
  req.session.destroy();

  return res.redirect("/login");
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  // req.session.loggedIn = false;
  // req.session.user = null;
  return res.status(201).redirect("/");
};
