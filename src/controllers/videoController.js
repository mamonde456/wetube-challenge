import fs from "fs";
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "home", videos });
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "upload video" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, overview, hashtags },
  } = req;
  console.log(hashtags);
  try {
    await Video.create({
      title,
      overview,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (err) {
    return res.render("upload", {
      pageTitle: "Error upload video",
      errorMessage: err,
    });
  }
};

export const watch = (req, res) => {
  res.send("wacth");
};
export const edit = (req, res) => {
  res.send("edit");
};

export const search = (req, res) => {
  res.send("search");
};

export const deleteVideo = (req, res) => {
  res.send("delete video");
};
