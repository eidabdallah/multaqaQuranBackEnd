import { Router } from "express";
import DailyFollowUpService from './../services/DailyFollowUp/dailyFollowUp.service';
import DailyFollowUpController from './../controller/DailyFollowUp/dailyFollowUp.controller';
import { Validator } from './../middleware/validation';
import { AuthMiddleware } from './../middleware/auth.middleware';
import { endPoints } from './../utils/EndPoint';
import { AsyncHandler } from './../utils/errorHandling/AsyncHandler';
import { DailyFollowUpValidation } from './../validation/dailayFollow.validation';


const router = Router();
const dailyFollowService = new DailyFollowUpService();
const dailyFollowController = new DailyFollowUpController(dailyFollowService);

router.post("/" ,Validator.validate(DailyFollowUpValidation.createDailyFollowUpSchema) ,AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.create));
router.patch("/:id" , Validator.validate(DailyFollowUpValidation.updateDailyFollowUpSchema) ,AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.update));
router.delete("/:id" ,Validator.validate(DailyFollowUpValidation.idDailyFollowUpSchema) , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.delete));
router.get("/" , AuthMiddleware.authorize(endPoints.supervisorOrStudentOnly) ,AsyncHandler.asyncHandler(dailyFollowController.get));
// Supervisor views daily follow-up for a specific student by ID.
router.get("/statistics" ,Validator.validate(DailyFollowUpValidation.statisticsSchema) , AuthMiddleware.authorize(endPoints.adminOrDoctorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.getStatistics));
router.get("/:id" ,Validator.validate(DailyFollowUpValidation.idDailyFollowUpSchema) , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.getAll));

export default router;
