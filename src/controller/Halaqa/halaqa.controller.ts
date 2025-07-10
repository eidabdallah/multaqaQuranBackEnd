import { Request, Response, NextFunction } from 'express';
import { Roles } from '../../utils/enum/role.enum';
import HalaqaService from './../../services/Halaqa/halaqa.service';
import { BaseController } from '../base.controller.js';
import Halaqa from '../../Model/halaqa.model';
import { HalaqaCreationAttributes } from '../../interface/Halaqa/halaqaAttributes';
import { ICrudController } from '../../interface/crud.interface';
import { ApiError } from './../../utils/errorHandling/ApiError';
import UserService from '../../services/User/user.service.js';

export default class HalaqaController extends BaseController implements ICrudController<Halaqa> {
    constructor(private halaqaService: HalaqaService, private userService: UserService) {
        super();
    }
    create = async (req: Request, res: Response, next: NextFunction) => {
        const { halaqaName, supervisorId } = req.body;
        if (await this.halaqaService.checkHalaqaName(halaqaName))
            return next(new ApiError("اسم الحلقة مستخدم", 400));
        const checkSupervisor = await this.userService.checkIdWithCache(supervisorId);
        if (!checkSupervisor) {
            return next(new ApiError("المشرف غير موجود", 400));
        }
        if (checkSupervisor.role !== "TasmeaHifzSupervisor" && checkSupervisor.role !== "CollegeSupervisor" && checkSupervisor.role !== "TasmeaSupervisor") {
            return next(new ApiError("ليش مشرفا", 400));
        }
        const halaqa = await this.halaqaService.create(req.body);
        if (!halaqa) {
            return next(new ApiError("لم يتم انشاء الحلقة", 400));
        }
        return this.sendResponse(res, 201, "تم انشاء الحلقة بنجاح", halaqa);
    }
    // get Halaqat By College for college supervisor
    get = async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) { return next(new ApiError("لم يتم العثور على المستخدم", 400)); }
        const halaqat = await this.halaqaService.get({
             collegeName: user.CollegeName,
             gender: user.gender,
        });
        if (!halaqat) {
            return next(new ApiError("لم يتم العثور على الحلقات", 400));
        }
        return this.sendResponse(res, 200, "تم العثور على الحلقات", halaqat);
    }
    // get halaqa by id
    getOne = async (req: Request, res: Response, next: NextFunction) => {
        const { halaqaId } = req.params;
        const halaqa = await this.halaqaService.getOne(parseInt(halaqaId));
        if (!halaqa) {
            return next(new ApiError("لم يتم العثور على الحلقة", 400));
        }
        return this.sendResponse(res, 200, "تم العثور على الحلقة", halaqa);
    }
    // delete halaqa
    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const affectedRows = await this.halaqaService.delete(parseInt(id));
        if (affectedRows === 0) {
            return next(new ApiError("لم يتم حذف الحلقة", 400));
        }
        return this.sendResponse(res, 200, "تم حذف الحلقة بنجاح");
    }
    //get all supervisors who are not responsible for the halaqa yet
    getSuperVisorsByCollege = async (req: Request, res: Response, next: NextFunction) => { 
        const user = req.user;
        if (!user) { return next(new ApiError("لم يتم العثور على المستخدم", 400)); }
        const superVisors = await this.halaqaService.getSuperVisorsByCollege(user.CollegeName , user.gender);
        if (!superVisors) {
            return next(new ApiError("لم يتم العثور على المشرفين", 400));
        }
        return this.sendResponse(res, 200, "تم العثور على المشرفين", superVisors);
    }
    // update SuperVisor Halaqa
    update = async (req: Request, res: Response, next: NextFunction) => {
        const { halaqaId , supervisorId } = req.params;
        const checkSupervisor = await this.userService.checkIdWithCache(parseInt(supervisorId));
        if (!checkSupervisor) {
            return next(new ApiError("المشرف غير موجود", 400));
        }
        if(checkSupervisor.status === "No_Active"){
            return next(new ApiError("المشرف غير مفعل حسابه", 400));
        }
        if (checkSupervisor.role !== "TasmeaHifzSupervisor" && checkSupervisor.role !== "CollegeSupervisor" && checkSupervisor.role !== "TasmeaSupervisor") {
            return next(new ApiError("ليش مشرفا", 400));
        }
        // check if supervisor have halaqa already
        const checkSupervisorHalaqa = await this.halaqaService.checkSupervisorHaveHalaqa(parseInt(supervisorId));
        if (checkSupervisorHalaqa) {
            return next(new ApiError("المشرف لديه حلقة مسبقا", 400));
        }
        const affectedRows = await this.halaqaService.update(parseInt(halaqaId), {supervisorId : parseInt(supervisorId) , collegeName : checkSupervisor.CollegeName , gender : checkSupervisor.gender});
        if (affectedRows === 0) {
            return next(new ApiError("لم يتم تحديث المشرف", 400));
        }
        return this.sendResponse(res, 200, "تم تحديث المشرف بنجاح");
    }
    // fetch all student dont have halaqa
    getStudentsWithoutHalaqa = async (req: Request, res: Response, next: NextFunction) => { 
        const user = req.user;
        if (!user) { return next(new ApiError("لم يتم العثور على المستخدم", 400)); }
        const students = await this.halaqaService.getStudentsWithoutHalaqa(user.CollegeName , user.gender);
        if (!students) {
            return next(new ApiError("لم يتم العثور على الطلاب", 400));
        }
        return res.status(200).json({ message: "تم العثور على الطلاب", students });
    }
    updateStudentHalaqa = async (req: Request, res: Response, next: NextFunction) => { 
        const { studentId , halaqaId } = req.params;
        const checkHalaqa = await this.halaqaService.getOne(parseInt(halaqaId));
        if (!checkHalaqa) {
            return next(new ApiError("الحلقة غير موجودة", 400));
        }
        const checkStudent = await this.halaqaService.checkIdWithCache(parseInt(studentId));
        if (!checkStudent) {
            return next(new ApiError("الطالب غير موجود", 400));
        }
        const affectedRows = await this.halaqaService.updateStudentSupervisor(parseInt(studentId), parseInt(halaqaId));
        if (affectedRows === 0) {
            return next(new ApiError("لم يتم تحديث المشرف", 400));
        }
        return res.status(200).json({ message: "تم تحديث المشرف بنجاح" });
    }

}


