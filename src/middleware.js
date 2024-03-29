import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "wetube-challengeee/videos",
  acl: "public-read",
});
const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "wetube-challengeee/images",
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isHeroku = isHeroku;
  next();
};

export const protectMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const publicMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const uploadsAvatar = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  // storage: s3ImageUploader,
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const uploadsVideo = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
  // storage: s3VideoUploader,
  storage: isHeroku ? s3VideoUploader : undefined,
});
