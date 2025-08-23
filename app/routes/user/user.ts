import { Router } from 'express'

import  UsersController  from '../../controller/user/users'
import authMiddleware, {flexibleAuth} from '../../middleware/token'

const userRouter = Router();
const usersController = new UsersController();

userRouter.post('/register', usersController.register.bind(usersController));
userRouter.post('/login', usersController.login.bind(usersController));
userRouter.post('/logout', flexibleAuth, usersController.logout.bind(usersController));
userRouter.post('/refresh-token', usersController.refreshToken.bind(usersController));

export default userRouter;