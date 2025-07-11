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
    create = async(req: Request, res: Response, next: NextFunction) => {
         const { userId } = req.body;
        const checkStudent = await this.DailyFollowUpService.checkIdWithCache(parseInt(userId));
        if (!checkStudent) {
            return next(new ApiError("الطالب غير موجود", 400));
        }
        await this.DailyFollowUpService.create(req.body);
        return this.sendResponse(res, 200, "تم انشاء التقييم بنجاح");
    }



}

