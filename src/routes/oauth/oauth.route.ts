import { Router } from "express";
import { OAuth } from "../../middlewares/oauth.middleware";
import { Logout } from "../../controllers/oauth/logout/logout.controller";

const OAuthRoutes = Router();
OAuthRoutes.get("/login/oauth", OAuth).get("/logout", Logout);

export default OAuthRoutes;
