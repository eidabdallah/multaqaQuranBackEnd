import { Router } from "express";
import AdminService from './../services/Admin/admin.service';
import AdminController from './../controller/Admin/admin.controller';
import { AuthMiddleware } from './../middleware/auth.middleware';
import { endPoints } from './../utils/EndPoint';
import { AsyncHandler } from './../utils/errorHandling/AsyncHandler';
import { Validator } from "../middleware/validation";
import { AdminValidation } from './../validation/admin.validation';

const router = Router();
const adminService = new AdminService();
const adminController = new AdminController(adminService);

router.get("/", AuthMiddleware.authorize(endPoints.adminOnly) ,AsyncHandler.asyncHandler(adminController.get));
router.patch("/accept/:userId",Validator.validate(AdminValidation.acceptRequestSchema) ,AuthMiddleware.authorize(endPoints.adminOnly) ,AsyncHandler.asyncHandler(adminController.acceptRequest));
router.delete("/:id"  ,Validator.validate(AdminValidation.acceptRequestSchema) ,AuthMiddleware.authorize(endPoints.adminOnly) ,AsyncHandler.asyncHandler(adminController.delete));
router.post("/",Validator.validate(AdminValidation.createUserSchema) , AuthMiddleware.authorize(endPoints.adminOnly) ,AsyncHandler.asyncHandler(adminController.create));
router.patch("/confirmEmail/:userId",Validator.validate(AdminValidation.acceptRequestSchema) ,AuthMiddleware.authorize(endPoints.adminOnly) ,AsyncHandler.asyncHandler(adminController.changeConfirmEmail));


export default router;
