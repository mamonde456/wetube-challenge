import fs from "fs";

export const home = async (req, res) => {
  return res.render("home", { pageTitle: "home" });
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
