import {Router} from 'express';
import AuthController from "../controllers/auth.controller.js";

export const authRouter = Router();

const {signIn, refresh, logout} = AuthController

authRouter.post("/sign-in", signIn)
authRouter.get("/refresh", refresh)
authRouter.get("/logout", logout)