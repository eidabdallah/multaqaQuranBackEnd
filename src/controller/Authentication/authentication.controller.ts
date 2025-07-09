import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../base.controller';
import AuthService from './../../services/authentication/auth.service';
import { ApiError } from './../../utils/errorHandling/ApiError';
import { UserAttributes } from './../../interface/User/userAttributes';
import jwt from 'jsonwebtoken';
import { confirmEmailMessage, sendConfirmEmail, sendCode } from './../../utils/emailTemplete/authTemplete';
import { ICrudController } from '../../interface/crud.interface.js';
import User from './../../Model/user.model';
import { extractUniversityIdFromEmail } from './../../utils/authHelpers/emailUtils';
import { generateRandomCode } from './../../utils/authHelpers/generateCode';

export default class AuthController extends BaseController implements ICrudController<User, UserAttributes> {
    constructor(private authService: AuthService) {
        super();
    }
    create = async (req: Request, res: Response, next: NextFunction) => {
        const { universityId, fullName } = req.body;
        const exists = await this.authService.checkUniversityId(universityId);
        if (exists) return next(new ApiError("الرقم الجامعي مستخدم", 400));
        await this.authService.create(req.body);
        await sendConfirmEmail(universityId, fullName, req);
        return this.sendResponse(res, 201, "تم إنشاء الحساب، الرجاء التحقق من ايميلك الجامعي للتاكيد");
    };
    login = async (req: Request, res: Response, next: NextFunction) => {
        const { universityId, password } = req.body;
        const user = await this.authService.checkUniversityId(universityId, ['id', 'fullName', 'password', 'universityId', 'status', 'phoneNumber', 'CollegeName', 'role', 'confirmEmail']);
        if (!user) {
            return next(new ApiError("معلومات المستخدم خاطئة", 400));
        }
        if (!await this.authService.validatePassword(password, user.password)) {
            return next(new ApiError("معلومات المستخدم خاطئة", 400));
        }
        if (user.confirmEmail !== true)
            return next(new ApiError("الرجاء تأكيد الايميل الجامعي", 400));
        if (user.status === "No_Active")
            return next(new ApiError("لم يتم تفعيل الحساب بعد من قبل المسؤول", 400));
        const token = jwt.sign({ id: user.id, universityId: user.universityId }, process.env.JWT_SECRET_LOGIN!, { expiresIn: '1d' });
        return this.sendResponse(res, 200, "تم تسجيل الدخول", token, 'token');
    }
    confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        const { token } = req.params;
        const payload = jwt.verify(token, process.env.JWT_SECRET_ConfirmEmail!) as { email: string };
        const universityId = extractUniversityIdFromEmail(payload.email);
        if (!universityId) return next(new ApiError("صيغة الإيميل خاطئة", 400));
        const user = await this.authService.checkUniversityId(universityId, ['id', 'confirmEmail', 'fullName']);
        if (!user)
            return next(new ApiError("المستخدم غير موجود", 404));
        user.confirmEmail = true;
        await user.save();
        confirmEmailMessage(user.fullName, res);
    };
    getOne = async (req: Request, res: Response) => {
        return res.status(200).json({ message: "بيانات المستخدم", user: req.user });
    };
    changePassword = async (req: Request, res: Response, next: NextFunction) => {
        const { universityId, oldPassword, newPassword } = req.body;
        const user = req.user;
        if (!user) return next(new ApiError("المستخدم غير موجود", 404));
        if (universityId !== user.universityId)
            return next(new ApiError("رقم جامعي غير مطابق", 400));
        const userPassword = await this.authService.checkId(user.id, ['password']);
        if (!userPassword)
            return next(new ApiError("المستخدم غير موجود", 404));
        if (!await this.authService.validatePassword(oldPassword, user.password))
            return next(new ApiError("كلمة المرور القديمة خاطئة", 400));
        user.password = await this.authService.hashPassword(newPassword);
        await userPassword.save();
        return this.sendResponse(res, 200, "تم تغيير كلمة المرور بنجاح");
    };
    sendCode = async (req: Request, res: Response, next: NextFunction) => {
        const { universityId } = req.body;
        const user = await this.authService.checkUniversityId(universityId);
        if (!user)
            return next(new ApiError("المستخدم غير موجود", 404));
        const code = generateRandomCode();
        await this.authService.SaveCode(user.id, code);
        await sendCode(universityId, code);
        return res.status(200).json({ message: "تم ارسال كود التحقق بنجاح" });
    }
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        const { universityId, code, newPassword } = req.body;
        const user = await this.authService.checkUniversityId(universityId, ['id', 'password']);
        if (!user)
            return next(new ApiError("المستخدم غير موجود", 404));
        const valid = await this.authService.checkCode(user.id, code);
        if (!valid)
            return next(new ApiError("كود التحقق غير صحيح", 400));
        user.password = await this.authService.hashPassword(newPassword);
        await this.authService.deleteCode(user.id, code);
        await user.save();
        return res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
    }

}

