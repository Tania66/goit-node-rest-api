import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import { join } from "path";
import Jimp from "jimp";
import { rename } from "fs/promises";
import shortid from "shortid";
import { emailSend } from "../helpers/sendEmail.js";

const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = join("./", "public", "avatars");

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      throw HttpError(409, "Email in use");
    }
    const createHashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);
    const verificationToken = shortid.generate();
    const result = await User.create({
      email,
      password: createHashPassword,
      avatarUrl,
      verificationToken,
    });

    if (result) {
      const { email, subscription } = result;
      const newOwner = { user: { email, subscription } };
      res.status(201).json(newOwner);
    } else {
      throw HttpError(404);
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a href="${BASE_URL}api/users/verify/${verificationToken}">Click verify email</a>`,
      text: `please open link to confirm tour registration ${BASE_URL}api/users/verify/${verificationToken}`,
    };
    await emailSend(verifyEmail);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Incorrect login or password");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verify");
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw HttpError(401, "Incorrect login or password");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "3d" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

export const avatarUser = async (req, res, next) => {
  try {
    const { path: tempDir, originalname } = req.file;
    const fileName = `${req.user.id}_${originalname}`;
    const result = join(avatarDir, fileName);
    const image = await Jimp.read(tempDir);
    await rename(tempDir, result);
    const avatarUrl = join("avatars", fileName);
    await image.resize(250, 250).writeAsync(result);
    await User.findByIdAndUpdate(req.user.id, { avatarUrl }, { new: true });
    res.status(200).json({ avatarUrl });
  } catch (error) {
    next(error);
  }
};

export const verificationEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user.id, {
      verify: true,
    });
    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const refreshVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Not found");
    }

    if (user.verify) {
      throw HttpError(401, "Already verify");
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a href="${BASE_URL}api/users/verify/${user.verificationToken}">Click verify email</a>`,
      text: `please open link to confirm tour registration ${BASE_URL}api/users/verify/${user.verificationToken}`,
    };
    await emailSend(verifyEmail);

    res.json({ message: "Verification email send success" });
  } catch (error) {
    next(error);
  }
};
