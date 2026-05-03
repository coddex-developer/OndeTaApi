import {Router} from "express";
import userController from "../../controllers/userController/user_controller";
import { authMiddleware } from "../../middlewares/auth";
const userRouter = Router();

userRouter.post('/register', userController.createAccount);
userRouter.post('/login', userController.login);
userRouter.get('/profile', authMiddleware, userController.getProfile);
userRouter.patch('/user/update/:id', authMiddleware, userController.updateAccount);
userRouter.patch('/user/change-password/:id', authMiddleware, userController.changePassword);
userRouter.delete('/user/:id', authMiddleware, userController.deleteAccount);
userRouter.get('/user/stats', authMiddleware, userController.getUserStats);

export default userRouter;