import { Optional } from 'sequelize';
import { BaseAttributes } from './../baseAttributes';
export interface ExamRequestAttributes extends BaseAttributes {
    StudentId: number;
    SupervisorId: number;
    examType: 'تجريبي' | 'رسمي';
    timeExam: string;
    date: string;
    status: "انتظار" | "تاكيد" | "رفض";
    parts: string;
    examPattern: 'تثبيت' | 'عادي';
}


export interface ExamRequestCreationAttributes extends Optional<ExamRequestAttributes, 'id' | 'createdAt' | 'updatedAt'> {}