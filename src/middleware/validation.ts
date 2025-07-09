import Joi, { ObjectSchema } from 'joi';
import { Response, NextFunction , Request } from 'express';

export class Validator {
  static generalFields = {
    id: Joi.number().min(1).required().messages({
      "number.base": "يجب أن يكون رقم المعرف رقماً.",
      "number.min": "رقم المعرف يجب أن يكون 1 أو أكبر.",
      "any.required": "حقل المعرف مطلوب.",
    }),
    universityId: Joi.string().pattern(/^\d{4}$|^\d{8}$/).required().messages({
    "string.pattern.base": "يجب أن يتكون رقم الجامعة من 4 أو 8 أرقام.",
    "any.required": "رقم الجامعة مطلوب."
  }),
    password: Joi.string().min(8).max(32).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/).required().messages({
      "string.min": "كلمة المرور يجب أن تكون على الأقل 8 أحرف.",
      "string.max": "كلمة المرور يجب ألا تتجاوز 32 حرفًا.",
      "string.pattern.base": "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم وحرف خاص على الأقل.",
      "any.required": "كلمة المرور مطلوبة.",
    }),
    fullName: Joi.string().pattern(/^[ء-ي ]+$/).required().min(3).max(40).messages({
      "string.empty": "الاسم الكامل مطلوب.",
      "any.required": "الاسم الكامل مطلوب.",
      "string.min": "الاسم الكامل يجب أن يتكون من 3 أحرف على الأقل.",
      "string.max": "الاسم الكامل يجب ألا يتجاوز 40 حرفًا.",
      "string.pattern.base": "الاسم الكامل يجب أن يحتوي على أحرف عربية ومسافات فقط.",
    }),


  };

  static validate(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate({ ...req.body, ...req.params, ...req.query }, { abortEarly: false });

      if (error) {
        const errorMessages: Record<string, string> = {};
        error.details.forEach((err) => {
          const key = err.context?.key || 'unknown';
          errorMessages[key] = err.message;
        });
        return res.status(400).json({ message: "خطأ في التحقق من البيانات", error: errorMessages });
      }
      next();
    };
  }
}
