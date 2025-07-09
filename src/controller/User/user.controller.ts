import { Request, Response, NextFunction } from 'express';
import { ApiError } from './../../utils/errorHandling/ApiError';
import UserService from './../../services/User/user.service';
import { BaseController } from '../base.controller.js';
import { ICrudController } from '../../interface/crud.interface.js';
import User from './../../Model/user.model';
import { UserAttributes } from './../../interface/User/userAttributes';

export default class UserController extends BaseController implements ICrudController<User> {
    constructor(private userService: UserService) {
        super();
    }
    getOne = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const user = await this.userService.checkIdWithCache(parseInt(id));
        if (!user)
            return next(new ApiError("لم يتم العثور على المستخدم", 400));
        return this.sendResponse(res, 200, "معلومات المستخدم", user);
    }
    update = async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) return next(new ApiError("لم يتم العثور على المستخدم", 400));
        const {fullName , phoneNumber} = req.body;
        if(await this.userService.checkPhoneNumber(phoneNumber)) 
            return next(new ApiError("رقم الهاتف مستخدم", 400));
        const affectedCount = await this.userService.update(user.id, { fullName, phoneNumber });
        if(affectedCount === 0) 
            return next(new ApiError("لم يتم تحديث البيانات", 400));
        return this.sendResponse(res, 200, "تم تحديث البيانات بنجاح");
    };
     changeRole = async (req: Request, res: Response, next: NextFunction) => { 
        const { id , role } = req.body;
        const affectedRows = await this.userService.changeRoleStudent(parseInt(id), role);
        if (affectedRows === 0) {
            return next(new ApiError("لم يتم تحديث ", 400));
        }
        return this.sendResponse(res, 200, "تم تحديث  بنجاح");
    }  
}
