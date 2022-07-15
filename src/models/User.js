import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, requierd: true, unique: true },
  name: { type: String, requierd: true },
  password: { type: String, requierd: true },
  email: { type: String, requierd: true, unique: true },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

export default User;
