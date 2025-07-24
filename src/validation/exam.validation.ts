import Joi from "joi";
import { Validator } from './../middleware/validation';

export class ExamValidation {
    static assignExamToSupervisorSchema = Joi.object({
        examId: Validator.generalFields.id,
    });
    static insertExamGradeSchema = Joi.object({
        examId: Validator.generalFields.id,
        grade: Joi.number().min(0).max(100).required().messages({
            'any.required': 'الدرجة مطلوبة',
            'number.base': 'الدرجة يجب ان تكون رقم',
            'number.min': 'الدرجة يجب ان تكون بين 0 و 100',
            'number.max': 'الدرجة يجب ان تكون بين 0 و 100',
        })
    });
    static createFormalExamSchema = Joi.object({
        StudentId : Validator.generalFields.id,
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
        examPattern: Joi.string().valid('تثبيت', 'عادي').required().messages({
            "any.only": "نمط الامتحان يجب أن يكون 'تثبيت' أو 'عادي'.",
            "any.required": "نمط الامتحان  مطلوب.",
        }),
    });
}
