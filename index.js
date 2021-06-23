import express from "express";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./connection/db.js";

import userRoute from "./routes/userRoute.js";

connectDB();

const app = express();
app.use(express.json());

app.use("/user", userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started at https://locahost:${PORT}`);
});
