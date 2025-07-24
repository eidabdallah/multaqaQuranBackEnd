import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../base.controller.js';
import { ICrudController } from '../../interface/crud.interface';
import { ApiError } from './../../utils/errorHandling/ApiError';
import UserService from '../../services/User/user.service.js';
import Exam from './../../Model/exam.model';
import ExamService from './../../services/Exam/Exam.service';

export default class ExamController extends BaseController implements ICrudController<Exam> {
    constructor(private examService: ExamService) {
        super();
    }
    // getAllExamsRequest
    get = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const supervisorHalaqa = await this.examService.getSupervisorHalaqaId(user.id);
        const exams = await this.examService.getExamsBySupervisorHalaqa(supervisorHalaqa);
        if (!exams || exams.length === 0) {
            return next(new ApiError("لم يتم العثور على الامتحانات", 400));
        }
        return res.status(200).json({ message: "تم العثور على الامتحانات", exams });
    }
    getPendingExamsBySupervisor = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const exams = await this.examService.getPendingExamsBySupervisor(user.id);
        if (!exams || exams.length === 0) {
            return next(new ApiError("لم يتم العثور على الامتحانات", 400));
        }
        return res.status(200).json({ message: "تم العثور على الامتحانات", exams });
    }
    assignExamToSupervisor = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const { examId } = req.params;
        const affectedRows = await this.examService.assignExamToSupervisor(parseInt(examId), user.id);
        if (affectedRows === 0) {
            return next(new ApiError("لا يوجد امتحان لهذا الطالب", 400));
        }
        return res.status(200).json({ message: "تم تعيين الامتحان للمشرف بنجاح" });
    }
    insertExamGrade = async (req: Request, res: Response, next: NextFunction) => {
        const { examId, grade } = req.body;
        const affectedRows = await this.examService.insertExamGrade(parseInt(examId), grade);
        if (affectedRows === 0) {
            return next(new ApiError("لا يوجد امتحان لهذا الطالب", 400));
        }
        return res.status(200).json({ message: "تم ادخال العلامة بنجاح" });
    }
    getStudentExam = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const exams = await this.examService.getStudentExams(parseInt(user.id));
        if (!exams || exams.length === 0) {
            return next(new ApiError("لم يتم العثور على الامتحانات", 400));
        }
        const gradedExams = exams.filter(e => e.grade !== null);
        const supervisedExams = exams.filter(e => e.grade === null && e.SupervisorId !== null);
        const unsupervisedExams = exams.filter(e => e.grade === null && e.SupervisorId === null);

        return res.status(200).json({
            message: "تم العثور على الامتحانات",
            exams: [
                {
                    title: "امتحانات يلي تم تقديمها",
                    data: gradedExams
                },
                {
                    title: "بانتظار التقديم (تم اختيارها من مشرف)",
                    data: supervisedExams
                },
                {
                    title: "بانتظار تحديد المشرف",
                    data: unsupervisedExams
                }
            ]
        });
    }
    getStudentForSupervisor = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const supervisorHalaqa = await this.examService.getSupervisorHalaqaId(user.id);
        if (!supervisorHalaqa) {
            return next(new ApiError("لم يتم العثور على المشرف", 400));
        }
        const students = await this.examService.getStudentsForSupervisor(supervisorHalaqa.id);
        if (!students || students.length === 0) {
            return next(new ApiError("لم يتم العثور على الطلاب", 400));
        }
        return res.status(200).json({ message: "تم العثور على الطلاب", students });

    }
    createFormalExam = async (req: Request, res: Response, next: NextFunction) => {
        req.body.examType = "رسمي";
        const exam = await this.examService.create(req.body);
        if (!exam) {
            return next(new ApiError("لم يتم انشاء الامتحان", 400));
        }
        return res.status(200).json({ message: "تم انشاء الامتحان بنجاح" });
    }
    getFormalExams = async (req: Request, res: Response, next: NextFunction) => {
        const exams = await this.examService.getFormalExams();
        if (!exams || exams.length === 0) {
            return next(new ApiError("لم يتم العثور على الامتحانات", 400));
        }
        return res.status(200).json({ message: "تم العثور على الامتحانات", exams });
    }

}


