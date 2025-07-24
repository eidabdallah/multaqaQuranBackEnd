import { BaseService } from '../base.service';
import { ICrudService } from './../../interface/crud.interface';
import { CacheManager } from './../../utils/nodeCache/cache';
import ExamRequest from '../../Model/examRequest.model.js';
import { ExamRequestAttributes } from '../../interface/ExamRequest/examRequestAttributes.js';
import User from './../../Model/user.model';
import Halaqa from './../../Model/halaqa.model';
import { ExamRequestStatus } from '../../utils/enum/ExamRequestStatus.js';
import Exam from './../../Model/exam.model';
export default class ExamRequestService extends BaseService<ExamRequest> implements ICrudService<ExamRequest, ExamRequestAttributes> {
    constructor() {
        super(ExamRequest);
    }
     async checkStudent(studentId: number): Promise<User | null> {
        let user  = CacheManager.get(`user_${studentId}`) as User | null;
        if (user) return user;

        user = await User.findByPk(studentId);
        if (user) {
            CacheManager.set(`user_${studentId}`, user);
        }
        return user;
    }
    async getSupervisorByHalaqa(halaqaId: number): Promise<number | null> {
        const halaqa = await Halaqa.findByPk(halaqaId, { attributes: ['supervisorId'] });
        if (!halaqa) {
            return null;
        }
        return halaqa.supervisorId;
    }
    async create(data: ExamRequest): Promise<ExamRequest> {
        return await ExamRequest.create(data);
    }
    async getExamRequestsByStudent(studentId: number): Promise<ExamRequestAttributes[]> {
        return await ExamRequest.findAll({ where: { StudentId: studentId } });
    }
    async getExamRequestsBySupervisor(supervisorId: number): Promise<ExamRequestAttributes[]> {
        return await ExamRequest.findAll({
            where: { SupervisorId: supervisorId },
            attributes: { exclude: ['createdAt', 'updatedAt', 'StudentId'] },
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'fullName']
                }
            ]
        });
    }
    async getExamRequestById(id: number): Promise<ExamRequestAttributes | null> {
        return await ExamRequest.findByPk(id , { attributes: { exclude: ['createdAt', 'updatedAt' , 'SupervisorId' , 'id'] }});
    }
    async changeStatusExamRequest(id: number, status: ExamRequestStatus , examData: ExamRequestAttributes): Promise<any> {
        if (status === ExamRequestStatus.REJECTED) {
            await ExamRequest.destroy({ where: { id } });
        }
        else if (status === ExamRequestStatus.APPROVED) {
            await ExamRequest.destroy({ where: { id } });
            await Exam.create({ StudentId: examData.StudentId ,examType: examData.examType , timeExam: examData.timeExam , date: examData.date , parts: examData.parts , examPattern: examData.examPattern });
        }
    }
}
