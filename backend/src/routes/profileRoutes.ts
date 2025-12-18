import  express  from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import upload from "../middleware/upload";
import { getMe, uploadAvatar } from "../controller/profileController";

const router  = express.Router()

router.use(authMiddleware)

router.post('/me', getMe);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
export default router


