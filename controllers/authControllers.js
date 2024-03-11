import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import { join } from "path";
import Jimp from "jimp";
import { rename } from "fs/promises";

const { SECRET_KEY } = process.env;

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
    const result = await User.create({
      email,
      password: createHashPassword,
      avatarUrl,
    });
    if (result) {
      const { email, subscription } = result;
      const newOwner = { user: { email, subscription } };
      res.status(201).json(newOwner);
    } else {
      throw HttpError(404);
    }
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
