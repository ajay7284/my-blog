import { Router } from "express";
import { verifyToken } from "../middlerwares/verifyUser.js";
import { createComment, getPostComments, likeComment,editComment, deleteComment,getcomments } from "../controllers/comment.controller.js";

const router = Router();

router.route("/create").post(verifyToken,createComment)
router.route("/getPostComments/:postId").get(getPostComments)
router.route("/likecomment/:commentId").put(verifyToken,likeComment)
router.route("/editcomment/:commentId").put(verifyToken,editComment)
router.route("/deletecomment/:commentId").delete(verifyToken,deleteComment)
router.route("/getcomments").get(verifyToken,getcomments)
export default router;