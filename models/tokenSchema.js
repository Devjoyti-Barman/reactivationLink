import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: { type: String, required: true },
  createdAt: { type: Date, expires: "5m", default: Date.now },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;
