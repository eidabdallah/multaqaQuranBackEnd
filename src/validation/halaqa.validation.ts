import Joi from "joi";
import { Validator } from './../middleware/validation';
import { Roles } from "../utils/enum/role.enum";
import { CollegesEnum } from "../utils/enum/college.enum";

export class HalaqaValidation {
    static createHalaqaSchema = Joi.object({
        supervisorId: Validator.generalFields.id,
        CollegeName: Joi.string().valid(...Object.values(CollegesEnum)).required().messages({
            "any.only": "الكلية غير صالحة.",
            "any.required": "الكلية مطلوبة.",
        }),
        gender: Joi.string().valid('Male', 'Female').required().messages({
            "any.only": "الجنس يجب أن يكون 'ذكر' أو 'أنثى'.",
            "any.required": "الجنس مطلوب.",
        }),
        halaqaName: Joi.string().required().messages({
            "string.empty": "اسم الحلقة مطلوب.",
            "any.required": "اسم الحلقة مطلوب.",
        })
    })
    static allStudentsByCollegeSchema = Joi.object({
        role: Joi.string().valid(...Object.values(Roles)).messages({
            'any.only': 'الدور المدخل غير صالح، القيم المسموحة هي: Student, Doctor, TasmeaSupervisor,TasmeaHifzSupervisor, CollegeSupervisor',
            'string.base': 'الدور يجب أن يكون نص',
        }),
        search: Joi.string().messages({
            "string.empty": "الاسم مطلوب.",
            "any.required": "الاسم مطلوب.",
        })
    })
    static getHalaqaByIdSchema = Joi.object({
        halaqaId: Validator.generalFields.id,
    })
     static deleteHalaqaSchema = Joi.object({
        halaqaId: Validator.generalFields.id,
    })
    static updateStudentHalaqaSchema = Joi.object({
        halaqaId: Validator.generalFields.id,
        studentId : Validator.generalFields.id
    })
     static updateSuperVisorHalaqaSchema = Joi.object({
        halaqaId: Validator.generalFields.id,
        supervisorId : Validator.generalFields.id
    })
    static deleteUserFromHalaqaSchema = Joi.object({
        studentId: Validator.generalFields.id,
    })
    
}
