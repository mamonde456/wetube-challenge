import fs from "fs";
import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "home", videos });
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "upload video" });
};
export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { title, overview, hashtags },
    files: { video, thumb },
  } = req;

  try {
    const newVideo = await Video.create({
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      title,
      overview,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (err) {
    return res.status(400).render("upload", {
      pageTitle: "Error upload video",
      errorMessage: err,
    });
  }
};

export const watch = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id).populate("owner").populate("comments");
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
    files: { video, thumb },
  } = req;
  const { id } = req.params;
  await Video.findByIdAndUpdate(id, {
    fileUrl: video ? video[0].path : fileUrl,
    thumbUrl: thumb ? thumb[0].path : thumb,
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
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "search for video", videos });
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const viewApi = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const commentsApi = async (req, res) => {
  const {
    body: { text },
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  if (!text) {
    return;
  }
  const video = await Video.findById(id);
  const user = await User.findById(_id);
  if (!video) {
    return res.sendStatus(400);
  }
  const comment = await Comment.create({
    name: user.name,
    text,
    owner: _id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  user.comments.push(comment._id);
  user.save();

  return res.status(201).json({
    avatarUrl: user.avatarUrl,
    newCommentId: comment._id,
    name: comment.name,
    createdAt: comment.createdAt,
  });
};

export const commentDelete = async (req, res) => {
  const {
    body: { newCommentId },
  } = req;
  const comment = await Comment.findByIdAndDelete(newCommentId);
  return res.sendStatus(201);
};
