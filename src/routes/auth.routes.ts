import { Router } from "express";
import { AuthValidation } from './../validation/auth.validation';
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import AuthService from './../services/authentication/auth.service';
import AuthController from './../controller/Authentication/authentication.controller';
import { AsyncHandler } from './../utils/errorHandling/AsyncHandler';
import { AuthMiddleware } from './../middleware/auth.middleware';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", Validator.validate(AuthValidation.registerSchema) ,AsyncHandler.asyncHandler(authController.create));
router.post("/login", Validator.validate(AuthValidation.loginSchema) ,AsyncHandler.asyncHandler(authController.login));
router.get('/confirmEmail/:token', AsyncHandler.asyncHandler(authController.confirmEmail));
router.get("/user", AuthMiddleware.authorize(endPoints.all), AsyncHandler.asyncHandler(authController.getOne));
router.patch("/changePassword", AuthMiddleware.authorize(endPoints.all), Validator.validate(AuthValidation.changePasswordSchema) ,AsyncHandler.asyncHandler(authController.changePassword));
router.post("/sendCode",Validator.validate(AuthValidation.sendCodeSchema) , AsyncHandler.asyncHandler(authController.sendCode));
router.patch("/forgotPassword",Validator.validate(AuthValidation.forgotPasswordSchema) , AsyncHandler.asyncHandler(authController.forgotPassword));


export default router;
