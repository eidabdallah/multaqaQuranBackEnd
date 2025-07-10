import { Router } from "express";
import HalaqaService from './../services/Halaqa/halaqa.service';
import HalaqaController from './../controller/Halaqa/halaqa.controller';
import UserService from './../services/User/user.service';
import { Validator } from './../middleware/validation';
import { HalaqaValidation } from './../validation/halaqa.validation';
import { AuthMiddleware } from './../middleware/auth.middleware';
import { endPoints } from './../utils/EndPoint';
import { AsyncHandler } from './../utils/errorHandling/AsyncHandler';

const router = Router();
const halaqaService = new HalaqaService();
const userService = new UserService();
const halaqaController = new HalaqaController(halaqaService , userService);

router.post("/", Validator.validate(HalaqaValidation.createHalaqaSchema) , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.create));
router.get("/" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.get));
router.get("/supervisor" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.getSuperVisorsByCollege));
router.get("/students" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.getStudentsWithoutHalaqa));
router.get("/allStudent" ,Validator.validate(HalaqaValidation.allStudentsByCollegeSchema) ,AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.allStudentsByCollege));
router.get("/:halaqaId" ,Validator.validate(HalaqaValidation.getHalaqaByIdSchema) ,AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.getOne));
router.delete("/:halaqaId" ,Validator.validate(HalaqaValidation.deleteHalaqaSchema),AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.delete));
router.patch("/:halaqaId/student/:studentId" ,Validator.validate(HalaqaValidation.updateStudentHalaqaSchema), AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.updateStudentHalaqa));
router.patch("/:halaqaId/supervisor/:supervisorId" ,Validator.validate(HalaqaValidation.updateSuperVisorHalaqaSchema) ,AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.update));
router.patch("/deleteUser/:studentId" ,Validator.validate(HalaqaValidation.deleteUserFromHalaqaSchema), AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.deleteUserFromHalaqa));

export default router;
