import { Router } from "express";
import { getProfile } from "../controllers/auth.controller.js";

const router = Router();

router.route("/").get((req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
router.route("/profile").get(getProfile);

export default router;