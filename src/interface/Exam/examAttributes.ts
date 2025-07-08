import { BaseAttributes } from "../baseAttributes";
import { Optional } from 'sequelize';

export interface ExamAttributes extends BaseAttributes{
    StudentId: number;
    SupervisorId: number | null;
    examType: 'تجريبي' | 'رسمي';
    timeExam: string;
    date: string;
    parts: string;
    examPattern: 'تثبيت' | 'عادي';
    grade: number | null;
    statusGrade: 'راسب' | 'ناجح' | null;
}

export interface ExamCreationAttributes extends Optional<ExamAttributes, 'id' | 'createdAt' | 'updatedAt'> {}