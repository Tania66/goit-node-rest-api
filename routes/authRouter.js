import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  loginUserJoiSchema,
  registerUserJoiSchema,
} from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/users/register",
  validateBody(registerUserJoiSchema),
  registerUser
);
authRouter.post("/users/login", validateBody(loginUserJoiSchema), loginUser);
authRouter.get("/users/current", authenticate, currentUser);
authRouter.post("/users/logout", authenticate, logoutUser);

export default authRouter;
