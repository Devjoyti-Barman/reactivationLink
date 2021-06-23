import express from "express";

import {
  registerUser,
  login,
  activateAccount,
  activationLink,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/signup").post(registerUser);
router.route("/login").post(login);
router.route("/activate-account").post(activateAccount);
router.route("/activation-link").post(activationLink);

export default router;
