import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
    getCommentReplies
} from "../controllers/comments.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get(getVideoComments);
router.route("/replies/").get(getCommentReplies);
router.route("/").post(verifyJWT, addComment);
router.route("/").delete(verifyJWT, deleteComment);
router.route("/").patch(verifyJWT, updateComment);

export default router