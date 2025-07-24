import Joi from "joi";
import { Validator } from './../middleware/validation';
import { Roles } from "../utils/enum/role.enum";

export class ExamRequestValidation {
    static createExamRequestSchema = Joi.object({
        parts: Joi.string().pattern(/^(\d+|\d+-\d+)$/).required().messages({
            "string.empty": "الأجزاء مطلوبة.",
            "any.required": "الأجزاء مطلوبة.",
            "string.pattern.base": "يجب إدخال رقم واحد مثل '1' أو مدى مثل '1-5'."
        }),
        timeExam: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
            "string.empty": "وقت الامتحان مطلوب.",
            "any.required": "وقت الامتحان مطلوب.",
            "string.pattern.base": "وقت الامتحان يجب أن يكون بتنسيق (ساعة:دقيقة) مثل 14:30."
        }),
        date: Joi.date().iso().required().messages({
            "date.base": "صيغة التاريخ غير صحيحة.",
            "date.format": "التاريخ يجب أن يكون بصيغة YYYY-MM-DD.",
            "any.required": "التاريخ مطلوب."
        }),
        examType: Joi.string().valid('رسمي', 'تجريبي').required().messages({
            "any.only": "نوع الامتحان يجب أن يكون 'تجريبي' أو 'رسمي'.",
            "any.required": "نوع الامتحان  مطلوب.",
        }),
        examPattern: Joi.string().valid('تثبيت', 'عادي').required().messages({
            "any.only": "نمط الامتحان يجب أن يكون 'تثبيت' أو 'عادي'.",
            "any.required": "نمط الامتحان  مطلوب.",
        }),
    });
    static changeStatusExamRequestSchema = Joi.object({
        id: Validator.generalFields.id,
        status : Joi.string().valid('انتظار', 'تاكيد', 'رفض').required().messages({
            'any.required': 'الحالة مطلوبة',
            'any.only': 'الحالة المدخل غير صالحة، القيم المسموحة هي: انتظار, تاكيد, رفض',
            'string.base': 'الحالة يجب ان يكون نص',
        })
    });
}
