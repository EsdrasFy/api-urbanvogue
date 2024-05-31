import { Router } from "express";
import { OAuth } from "../../middlewares/oauth.middleware";

const OAuthRoutes = Router();
OAuthRoutes.get('/login/oauth', OAuth);

export default OAuthRoutes;
