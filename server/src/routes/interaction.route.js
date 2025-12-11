import { Router } from 'express';
import {
    toggleVideoInteraction, toggleCommentInteraction, getLikedVideos, getVideoInteractions
} from "../controllers/interaction.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v").post(verifyJWT, toggleVideoInteraction);
router.route("/toggle/c").post(verifyJWT, toggleCommentInteraction);
router.route("/videos").get(verifyJWT, getLikedVideos);
router.route("/v").get(getVideoInteractions);

export default router