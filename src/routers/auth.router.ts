import {Router} from 'express';
import AuthController from "../controllers/auth.controller.js";

export const authRouter = Router();

const {signIn} = AuthController

authRouter.post("/sign-in", signIn)