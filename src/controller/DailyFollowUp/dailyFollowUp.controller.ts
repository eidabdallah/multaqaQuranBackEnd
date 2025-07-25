import { Request, Response, NextFunction } from 'express';
import DailyFollowUpService from './../../services/DailyFollowUp/dailyFollowUp.service';
import { BaseController } from '../base.controller.js';
import { ICrudController } from '../../interface/crud.interface.js';
import DailyFollowUp from './../../Model/dailyFollowUp.model';
import { ApiError } from './../../utils/errorHandling/ApiError';


export default class DailyFollowUpController extends BaseController implements ICrudController<DailyFollowUp> {
    constructor(private DailyFollowUpService: DailyFollowUpService) {
        super();
    }
    create = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.body;
        const checkStudent = await this.DailyFollowUpService.checkIdWithCache(parseInt(userId));
        if (!checkStudent) {
            return next(new ApiError("الطالب غير موجود", 400));
        }
        await this.DailyFollowUpService.create(req.body);
        return this.sendResponse(res, 200, "تم انشاء التقييم بنجاح");
    }
    update = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { ReviewInfo, date, note, savedInfo } = req.body;
        const updatedData: Record<string, any> = {};
        ReviewInfo !== undefined && (updatedData.ReviewInfo = ReviewInfo);
        date !== undefined && (updatedData.date = date);
        note !== undefined && (updatedData.note = note);
        savedInfo !== undefined && (updatedData.savedInfo = savedInfo);
        if (Object.keys(updatedData).length === 0) {
            return next(new ApiError("لا يوجد بيانات لتحديثها", 400));
        }
        const affectedRows = await this.DailyFollowUpService.update(parseInt(id), updatedData);
        if (affectedRows === 0) {
            return next(new ApiError("التقييم غير موجود", 404));
        }
        return this.sendResponse(res, 200, "تم التحديث بنجاح");
    }
    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const affectedRows = await this.DailyFollowUpService.delete(parseInt(id));
        if (affectedRows === 0) {
            return next(new ApiError("التقييم غير موجود", 404));
        }
        return res.status(200).json({ message: "تم الحذف بنجاح" });
    }
   //get all daily follow up for student 
    get = async (req: Request, res: Response, next: NextFunction) => {
        const id = (req as any).user.id;
        const dailyFollowUp = await this.DailyFollowUpService.getStudentFollowUps(id);
        if (!dailyFollowUp) {
            return next(new ApiError("لم يتم العثور على التقييم", 400));
        }
        return res.status(200).json({ message: "تم العثور على التقييم", dailyFollowUp });
    }
   // get All Daily Follow Up For SuperVisor
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const checkStudent = await this.DailyFollowUpService.checkIdWithCache(parseInt(id));
        if (!checkStudent) {
            return next(new ApiError("الطالب غير موجود", 400));
        }
        const dailyFollowUp = await this.DailyFollowUpService.getStudentFollowUps(parseInt(id), true);
        if (!dailyFollowUp) {
            return next(new ApiError("لم يتم العثور على التقييم", 400));
        }
        return res.status(200).json({ message: "تم العثور على التقييم", dailyFollowUp });
    }
    getStatistics = async (req: Request, res: Response, next: NextFunction) => {
        const {  college, halaqaName, gender } = req.query;

        const statistics = await this.DailyFollowUpService.getStatistics({
            college: college as string,
            halaqaName: halaqaName as string,
            gender: gender as string
        });

        return res.status(200).json({
            message: statistics.message,
            statistics: {
                totalSavedPages: statistics.totalSavedPages,
                totalReviewPages: statistics.totalReviewPages,
                examCount: statistics.examCount
            }
        });
    }




}

