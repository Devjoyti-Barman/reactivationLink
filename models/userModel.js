import mongoose from "mongoose";
import Bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../helpers/activationMail.js";
import Token from "./tokenSchema.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  /*
       When the save function is called, we will first check to see if the user is being created or changed. 
       If the user is not being created or changed, we will skip over the hashing part. 
       We don’t want to hash our already hashed data.

    */
  if (!this.isModified("password")) {
    return next();
  }

  this.password = Bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (candidatePassword) {
  return await Bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = async function () {
  const token = await jwt.sign({ _id: this._id }, process.env.jwtPrivateKey);
  return token;
};

userSchema.methods.ActivationLink = async function (email) {
  const jwtToken = await this.generateToken();
  const token = new Token({
    _userId: this._id,
    token: jwtToken,
  });
  const sessionToken = await token.save();

  const subject = "Link for Authentication";
  const content = `<h1> ${jwtToken} ${token._id}</h1>`;
  await sendMail(email, subject, content);
};

const User = mongoose.model("user", userSchema);

export default User;
