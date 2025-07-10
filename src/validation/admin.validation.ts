import Joi from "joi";
import { Validator } from './../middleware/validation';
import { CollegesEnum } from './../utils/enum/college.enum';
import { Roles } from "../utils/enum/role.enum";

export class AdminValidation {
    static createUserSchema = Joi.object({
        universityId: Validator.generalFields.universityId,
        fullName: Validator.generalFields.fullName,
        password: Validator.generalFields.password,
        phoneNumber: Joi.string().pattern(/^0\d{9}$/).required().messages({
            "string.empty": "رقم الهاتف مطلوب.",
            "any.required": "رقم الهاتف مطلوب.",
            "string.pattern.base": "رقم الهاتف يجب أن يبدأ بصفر ويتكون من 10 أرقام.",
        }),
        CollegeName: Joi.string().valid(...Object.values(CollegesEnum)).required().messages({
            "any.only": "الكلية غير صالحة.",
            "any.required": "الكلية مطلوبة.",
        }),
        gender: Joi.string().valid('Male', 'Female').required().messages({
            "any.only": "الجنس يجب أن يكون 'ذكر' أو 'أنثى'.",
            "any.required": "الجنس مطلوب.",
        }),
        role : Joi.string().valid(...Object.values(Roles)).required().messages({
            'any.required': 'الدور مطلوب',
            'any.only': 'الدور المدخل غير صالح، القيم المسموحة هي: Student, Doctor, Supervisor, CollegeSupervisor',
            'string.base': 'الدور يجب ان يكون نص',
        })
    });
    static acceptRequestSchema = Joi.object({
        userId: Validator.generalFields.id,
    });
}
