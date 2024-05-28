import { Router } from "express";
import { verifyToken } from "../middlerwares/verifyUser.js";
import { createpost, deletepost, getAllPost, updatepost } from "../controllers/post.controller.js";

const router = Router();

router.route("/createpost").post(verifyToken,createpost)
router.route("/getpost").get(getAllPost)
router.route("/deletepost/:postId/:userId").delete(verifyToken, deletepost)
router.route("/updatepost/:postId/:userId").put(verifyToken,updatepost)

export default router;