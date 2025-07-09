import { Router } from "express";
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import UserController from './../controller/User/user.controller';
import UserService from './../services/User/user.service';
import { AuthMiddleware } from './../middleware/auth.middleware';
import { AsyncHandler } from './../utils/errorHandling/AsyncHandler';
import { UserValidation } from './../validation/user.validation';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.patch("/", Validator.validate(UserValidation.updateInfoSchema) ,AuthMiddleware.authorize(endPoints.all) ,AsyncHandler.asyncHandler(userController.update));
router.get("/:id", Validator.validate(UserValidation.getUserSchema) , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(userController.getOne));
router.patch("/changeRole" , Validator.validate(UserValidation.changeRoleSchema) ,AuthMiddleware.authorize(endPoints.collegeSupervisorOrAdminOnly) ,AsyncHandler.asyncHandler(userController.changeRole));
export default router;
