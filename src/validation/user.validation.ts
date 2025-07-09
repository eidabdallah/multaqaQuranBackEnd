import Joi from "joi";
import { Validator } from './../middleware/validation';
import { Roles } from "../utils/enum/role.enum";

export class UserValidation {
    static updateInfoSchema = Joi.object({
        fullName: Validator.generalFields.fullName,
        phoneNumber: Joi.string().pattern(/^0\d{9}$/).required().messages({
            "string.empty": "رقم الهاتف مطلوب.",
            "any.required": "رقم الهاتف مطلوب.",
            "string.pattern.base": "رقم الهاتف يجب ان يبداء بصفر ويتكون من 10 ارقام.",
        }),
    })
    static getUserSchema = Joi.object({
        id: Validator.generalFields.id,
    })
    static changeRoleSchema = Joi.object({
        id: Validator.generalFields.id,
        role : Joi.string().valid(...Object.values(Roles)).required().messages({
            'any.required': 'الدور مطلوب',
            'any.only': 'الدور المدخل غير صالح، القيم المسموحة هي: Student, Doctor, Supervisor, CollegeSupervisor',
            'string.base': 'الدور يجب أن يكون نص',
        })
    })
}
