import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  avatarUser,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  loginUserJoiSchema,
  registerUserJoiSchema,
} from "../schemas/authSchemas.js";
import { upload } from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserJoiSchema), registerUser);
authRouter.post("/login", validateBody(loginUserJoiSchema), loginUser);
authRouter.get("/current", authenticate, currentUser);
authRouter.post("/logout", authenticate, logoutUser);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), avatarUser);

export default authRouter;
