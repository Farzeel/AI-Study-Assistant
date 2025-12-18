import  express  from "express";
import { validate } from "../middleware/validate";
import { registerSchema } from "../utils/userSchema";
import { googleLogin, login, logout, refresh, register } from "../controller/authController";
const router  = express.Router()

router.post('/register',validate(registerSchema) ,  register);

router.post('/login', login); 
router.post("/google", googleLogin);


router.get('/refresh-token', refresh);
router.post('/logout', logout);

export default router