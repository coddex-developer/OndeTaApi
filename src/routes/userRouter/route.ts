import {Router} from "express";
import userController from "../../controllers/userController/user_controller";
import { authMiddleware } from "../../middlewares/auth";
const userRouter = Router();

userRouter.post('/register', userController.createAccount);
userRouter.post('/login', userController.login);
userRouter.patch('/user/update/:id', authMiddleware, userController.updateAccount);

export default userRouter;