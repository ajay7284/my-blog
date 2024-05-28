import { Router } from "express";
import { verifyToken } from "../middlerwares/verifyUser.js";
import { deleteUser, signout, updateUser , getUsers,getUser} from "../controllers/user.controller.js";

const router = Router();

router.route("/update/:userId").put(verifyToken,updateUser)
router.route("/delete/:userId").delete(verifyToken,deleteUser)
router.route("/signout").post(verifyToken,signout)
router.route("/getusers").get(verifyToken,getUsers)
router.route("/:userId",getUser).get(getUser)

export default router;