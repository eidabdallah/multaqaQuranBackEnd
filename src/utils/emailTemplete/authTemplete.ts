import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import 'dotenv/config'
import { EmailService } from './sendEmail';

export const sendConfirmEmail = async (universityId: string, userName: string, req: Request) => {
    const email = `s${universityId}@stu.najah.edu`;
    const secret = process.env.JWT_SECRET_ConfirmEmail as string;
    const token = jwt.sign({ email }, secret, { expiresIn: 60 * 5 });
    const refreshToken = jwt.sign({ email }, secret, { expiresIn: '1h' });


    const html = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: linear-gradient(135deg, #007bff, #d97b32); padding: 30px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
        <img src="https://res.cloudinary.com/deylqxzgk/image/upload/v1751298424/unnamed_zbqxzz.jpg" 
             alt="${process.env.APPNAME} Logo" 
             style="width: 180px; display: block; margin: auto; background: white; padding: 10px; border-radius: 10px;" />
             
        <h1 style="color: white; font-size: 28px; margin-top: 20px;">مرحبا ${userName}</h1>
        
        <p style="font-size: 16px; color: white; line-height: 1.6;">
          شكرًا لانضمامك إلى <b>${process.env.APPNAME}</b> نحن متحمسون لوجودك معنا.
        </p>

        <p style="font-size: 16px; color: white; line-height: 1.6;">
          يرجى تأكيد بريدك الإلكتروني لتفعيل حسابك والاستمتاع بخدماتنا.
        </p>

        <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}" 
           style="display: inline-block; margin: 20px 0; padding: 12px 30px; font-size: 18px; font-weight: bold; color: white; background-color: #d97b32; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: 0.3s;">
           تأكيد البريد الإلكتروني
        </a>

        <p style="font-size: 14px; color: white; margin-top: 20px;">
          لم تتلقَ البريد الإلكتروني؟ اضغط على الرابط أدناه لإعادة إرساله:
        </p>

        <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${refreshToken}" 
           style="display: inline-block; padding: 10px 20px; font-size: 14px; font-weight: bold; color: #d97b32; background: white; text-decoration: none; border-radius: 8px; border: 2px solid #d97b32; transition: 0.3s;">
           إعادة إرسال التأكيد
        </a>

        <p style="font-size: 12px; color: #f1f1f1; margin-top: 20px; line-height: 1.5;">
          صلاحية رابط التأكيد 5 دقائق. إذا لم تطلب ذلك، يرجى تجاهل هذا البريد.
        </p>

        <hr style="border: none; border-top: 1px solid white; margin: 20px 0;" />

      </div>
    </div>
  `;

    EmailService.sendEmail({ to: `s${universityId}@stu.najah.edu`, subject: 'تم تسجيلك بنجاح', html });
}

export const confirmEmailMessage = (name: string, res: Response) => {
    const html = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: linear-gradient(135deg, #007bff, #d97b32); padding: 30px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
       <img 
  src="https://res.cloudinary.com/deylqxzgk/image/upload/v1751298424/unnamed_zbqxzz.jpg" 
  alt="${process.env.APPNAME} Logo" 
  style="width: 180px; height: 180px; display: block; margin: auto; background: white; padding: 10px; border-radius: 10px;" 
/>

             
        <h1 style="color: white; font-size: 28px; margin-top: 20px;">شكرًا لتأكيد بريدك الإلكتروني، ${name}</h1>
        
        <p style="font-size: 16px; color: white; line-height: 1.6;">
          تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن الوصول إلى حسابك والاستمتاع بجميع ميزات <b>${process.env.APPNAME}</b>
        </p>

        <p style="font-size: 16px; color: white; line-height: 1.6;">
          نحن سعداء بانضمامك إلينا، ونتطلع إلى تقديم خدماتنا لك.
        </p>

        <hr style="border: none; border-top: 1px solid white; margin: 20px 0;" />

        <footer style="font-size: 12px; color: #f1f1f1; text-align: center;">
          <p>© ${new Date().getFullYear()} ${process.env.APPNAME}. جميع الحقوق محفوظة.</p>
        </footer>
      </div>
    </div>
  `;
    res.set('Content-Type', 'text/html');
    return res.send(html);
}



export const sendCode = async (universityId: string, code : string) => {
  const html = `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: linear-gradient(135deg, #007bff, #d97b32); padding: 30px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
        <img src="https://res.cloudinary.com/deylqxzgk/image/upload/v1751298424/unnamed_zbqxzz.jpg" 
               alt="${process.env.APPNAME} Logo" 
               style="width: 180px; display: block; margin: auto; background: white; padding: 10px; border-radius: 10px;" />
               
          <h1 style="color: white; font-size: 28px; margin-top: 20px;">إليك رمز التحقق الخاص بك</h1>
          
          <p style="font-size: 16px; color: white; line-height: 1.6;">
            استخدم هذا الرمز لإعادة تعيين كلمة المرور الخاصة بك.
          </p>
  
          <div style="background-color: white; padding: 15px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); margin: 20px auto;">
            <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${code}</p>
          </div>
  
          <p style="font-size: 14px; color: white; margin-top: 20px;">
            إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.
          </p>
  
          <p style="font-size: 12px; color: #f1f1f1; margin-top: 20px; line-height: 1.5;">
            هذا الرمز صالح لفترة محدودة فقط.
          </p>
  
          <hr style="border: none; border-top: 1px solid white; margin: 20px 0;" />
        </div>
      </div>
    `;
    EmailService.sendEmail({ to: `s${universityId}@stu.najah.edu`, subject: 'ارسال كود التحقق', html });
};

