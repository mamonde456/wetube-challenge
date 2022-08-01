import fs from "fs";
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
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
    return res.status(400).render("upload", {
      pageTitle: "Error upload video",
      errorMessage: err,
    });
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", {
      pageTitle: "404",
      errorMessage: "sorry, video not found.",
    });
  }
  return res.render("watch", { pageTitle: `${video.title}`, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", {
      pageTitle: "404",
      errorMessage: "sorry, video not found.",
    });
  }
  res.render("editVideo", { pageTitle: `edit ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const {
    body: { title, overview, hashtags },
  } = req;
  const { id } = req.params;
  await Video.findByIdAndUpdate(id, {
    title,
    overview,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "search for video", videos });
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};
