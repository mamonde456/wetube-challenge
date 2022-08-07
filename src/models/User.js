import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  avatarUrl: { type: String },
  username: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, default: false },
  githubLogin: { type: Boolean, required: true, default: false },
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  intro: { type: String, default: "" },
  createdAt: { type: Date, required: true, default: Date.now },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

export default User;
