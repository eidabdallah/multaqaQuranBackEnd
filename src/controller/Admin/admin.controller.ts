import { NextFunction, Request, Response } from "express";
import { ICrudController } from "../../interface/crud.interface";
import AdminService from "../../services/Admin/admin.service";
import { BaseController } from "../base.controller";
import User from './../../Model/user.model';
import { ApiError } from './../../utils/errorHandling/ApiError';

export default class AdminController extends BaseController implements ICrudController<User> {
    constructor(private adminService: AdminService) {
        super();
    }
    get = async (req: Request, res: Response, next: NextFunction) => {
        const requests = await this.adminService.get();
        if (!requests || requests.length === 0) {
            return next(new ApiError("لم يتم العثور على الطلبات", 400));
        }
        return res.status(200).json({ message: "تم العثور على الطلبات", requests });
    }
    create = async (req: Request, res: Response, next: NextFunction) => {
        const { universityId, phoneNumber } = req.body;
        const checkUniversity = await this.adminService.checkUniversity(universityId);
        if (checkUniversity)
            return next(new ApiError("الرقم الجامعي  موجود", 400));
        const checkPhoneNumber = await this.adminService.checkPhoneNumber(phoneNumber);
        if (checkPhoneNumber)
            return next(new ApiError("رقم الهاتف مستخدم", 400));
        await this.adminService.create(req.body);
        return res.status(200).json({ message: "تم انشاء المستخدم بنجاح" });
    }
    changeConfirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const affectedRows = await this.adminService.changeConfirmEmail(parseInt(userId));
        if (affectedRows === 0)
            return next(new ApiError("المستخدم غير موجود أو لم يتم تغيير الحالة", 400));
        return res.status(200).json({ message: "تم تغيير حالة التاكيد بنجاح" });
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const affectedRows = await this.adminService.delete(parseInt(userId));
        if (affectedRows === 0)
            return next(new ApiError("المستخدم غير موجود أو لم يتم الحذف", 400));
        return res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
    }
    acceptRequest = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const affectedRows = await this.adminService.acceptRequest(parseInt(userId));
        if (affectedRows === 0) {
            return next(new ApiError("لم يتم قبول الطلب", 400));
        }
        return res.status(200).json({ message: "تم قبول الطلب بنجاح" });
    };

}