import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import Token from "../models/tokenSchema.js";

// send out email
import sendMail from "../helpers/activationMail.js";

const subject = "Link for Authentication";

// this is for register user
const registerUser = async (req, res) => {
  const { email } = req.body;
  const user = new UserModel({
    ...req.body,
  });
  try {
    const isFound = await UserModel.findOne({ email });

    if (isFound === null) {
      const saveUser = await user.save();
      const info = await saveUser.ActivationLink(email);

      res.send(saveUser);
    } else res.send("user is already exist");
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
};

// this is for user login

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  // is user does not exist then retrun
  if (user === null) return res.send("user does not exist");

  const isMatch = await user.matchPassword(password);

  if (isMatch) res.send(user);
  else res.send("Wrong Password");
};

// this is for verify accout

const activateAccount = async (req, res) => {
  const { token, tokenID } = req.body;

  if (token && tokenID) {
    try {
      const isValid = await jwt.verify(token, process.env.jwtPrivateKey); // will give us the id of user
      const user = await UserModel.findById(isValid._id); // fetching the user
      const Tokensession = await Token.findById(tokenID); // fetching the TokenSession
      // checking if token is exist in token schema or not
      // if it exist then checking the jwt token in Tokensession is same or not
      // and also checking the user in token session is same or not
      if (
        token === Tokensession.token &&
        Tokensession._userId.toString() === user._id.toString()
      ) {
        if (user.isVerified === true)
          return res
            .status(400)
            .json({ error: "The account is already activated" });
        user.isVerified = true;
        await user.save();
        res.send("successful");
      } else
        return res.status(400).json({ error: "Incorrect or Expired link." });
    } catch (error) {
      res.status(400).json({ error: "Incorrect or Expired link." });
    }
  } else return res.json({ error: "Something went Wrong" });
};

// this is for creating new Activation link

const activationLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user.isVerified === false) {
      user.ActivationLink(email);
      return res.send("The Activation Link is send");
    } else return res.send("The Account is already activated");
  } catch (error) {
    return res.json({ error: error });
  }
};

export { registerUser, login, activateAccount, activationLink };
