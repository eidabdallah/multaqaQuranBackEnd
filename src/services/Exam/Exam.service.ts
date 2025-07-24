import { UserCreationAttributes } from '../../interface/User/userAttributes';
import { Roles } from '../../utils/enum/role.enum';
import { BaseService } from '../base.service';
import User from './../../Model/user.model';
import { ICrudService } from './../../interface/crud.interface';
import { CacheManager } from './../../utils/nodeCache/cache';
import Exam from './../../Model/exam.model';
import { ExamCreationAttributes } from '../../interface/Exam/examAttributes.js';
import Halaqa from './../../Model/halaqa.model';
import { Op } from 'sequelize';
export default class ExamService extends BaseService<Exam> implements ICrudService<Exam, ExamCreationAttributes> {
    constructor() {
        super(Exam);
    }
    async getSupervisorHalaqaId(userId: number): Promise<Halaqa | null> {
        const halaqa = await Halaqa.findOne({ where: { supervisorId: userId }, attributes: ['id', 'CollegeName', 'gender'] });
        if (!halaqa) {
            return null;
        }
        return halaqa;
    }

    async getExamsBySupervisorHalaqa(supervisorHalaqa: Halaqa | null): Promise<Exam[] | null> {
        const includeCondition: any = {
            model: User,
            as: 'student',
            attributes: ['id', 'fullName', 'phoneNumber', 'universityId'],
            where: {}
        };
        if (supervisorHalaqa) {
            includeCondition.where = {
                CollegeName: supervisorHalaqa.collegeName,
                halaqaId: { [Op.ne]: supervisorHalaqa.id },
                gender: supervisorHalaqa.gender
            };
        }
        const exams = await Exam.findAll({
            where: { grade: null, SupervisorId: null },
            include: [includeCondition]
        });
        return exams;
    }
    async assignExamToSupervisor(examId: number, supervisorId: number): Promise<number> {
        const [affectedRows] = await Exam.update({ SupervisorId: supervisorId }, { where: { id: examId } });
        return affectedRows;
    }
    async getPendingExamsBySupervisor(supervisorId: number): Promise<Exam[] | null> {
        return await Exam.findAll({ 
            where: { grade: null, SupervisorId: supervisorId  },
            attributes : ['id', 'examType', 'timeExam', 'date', 'parts', 'examPattern' , 'grade', 'statusGrade'],
            include: [{ model: User, as: 'student', attributes: ['id', 'fullName', 'phoneNumber', 'universityId'] }] });
    }
    async insertExamGrade(examId: number, grade: number): Promise<number> {
        const statusGrade = grade >= 95 ? 'ناجح' : 'راسب';
        const [affectedRows] = await Exam.update({ grade , statusGrade }, { where: { id: examId } });
        return affectedRows;
    }
    async getStudentExams(id :number) : Promise<Exam[]> {
        return await Exam.findAll({ 
            where: { StudentId: id  },
            attributes : ['id', 'examType', 'timeExam', 'date', 'parts', 'examPattern' , 'grade', 'statusGrade' , 'SupervisorId'],
            include: [{ model: User, as: 'supervisor', attributes: ['fullName'] }]
        });
    }
    async getStudentsForSupervisor(halaqaId :number) : Promise<User[]> {
        return await User.findAll({ 
            where: { halaqaId},
            attributes : ['id', 'fullName'],
        });
    }
    async create(examData: Exam): Promise<Exam> {
        return await Exam.create(examData);
    }
    async getFormalExams(): Promise<Exam[]> {
        return await Exam.findAll({ 
            where: { examType: 'رسمي' , grade: null },
            attributes : ['id', 'examType', 'timeExam', 'date', 'parts', 'examPattern' , 'grade', 'statusGrade'],
        });
    }
}
