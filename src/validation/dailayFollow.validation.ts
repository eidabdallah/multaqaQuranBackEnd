import Joi from "joi";
import { Validator } from './../middleware/validation';
import { CollegesEnum } from "../utils/enum/college.enum.js";

export class DailyFollowUpValidation {
    static createDailyFollowUpSchema = Joi.object({
        userId: Validator.generalFields.id,
        savedInfo: Joi.string().required().messages({
            "string.empty": "معلومات الحفظ مطلوبة.",
            "any.required": "معلومات الحفظ مطلوبة.",
        }),
        ReviewInfo: Joi.string().required().messages({
            "string.empty": "معلومات المراجعة مطلوبة.",
            "any.required": "معلومات المراجعة مطلوبة.",
        }),
        note: Joi.string().required().messages({
            "string.empty": "الملاحظة مطلوبة.",
            "any.required": "الملاحظة مطلوبة.",
        }),
        pageNumberSaved: Joi.string().required().messages({
            "string.empty": "رقم صفحة الحفظ مطلوب.",
            "any.required": "رقم صفحة الحفظ مطلوب.",
        }),
        pageNumberReview: Joi.string().required().messages({
            "string.empty": "رقم صفحة المراجعة مطلوب.",
            "any.required": "رقم صفحة المراجعة مطلوب.",
        }),
        date: Joi.string().required().messages({
            "string.empty": "التاريخ مطلوب.",
            "any.required": "التاريخ مطلوب.",
        })
    })
    static updateDailyFollowUpSchema = Joi.object({
        savedInfo: Joi.string().messages({
            "string.empty": "معلومات الحفظ مطلوبة.",
        }),
        ReviewInfo: Joi.string().messages({
            "string.empty": "معلومات المراجعة مطلوبة.",
        }),
        note: Joi.string().messages({
            "string.empty": "الملاحظة مطلوبة.",
        }),
        pageNumberSaved: Joi.string().messages({
            "string.empty": "رقم صفحة الحفظ مطلوب.",
        }),
        pageNumberReview: Joi.string().messages({
            "string.empty": "رقم صفحة المراجعة مطلوب.",
        }),
        date: Joi.string().messages({
            "string.empty": "التاريخ مطلوب.",
        })
    })
    static idDailyFollowUpSchema = Joi.object({
        id: Validator.generalFields.id
    })
    static statisticsSchema = Joi.object({
        college: Joi.string().valid(...Object.values(CollegesEnum)).messages({
            "any.only": "الكلية غير صالحة.",
        }),
        halaqaName: Joi.string().messages({
            "string.base": "اسم الحلقة يجب أن يكون نصًا.",

        }),
        gender: Joi.string().valid('Male', 'Female').messages({
            "any.only": "الجنس يجب أن يكون 'Female' أو 'Male'.",
        }),
    })

}
