import { BaseService } from '../base.service';
import { HalaqaCreationAttributes } from '../../interface/Halaqa/halaqaAttributes';
import { ICrudService } from './../../interface/crud.interface';
import Halaqa from './../../Model/halaqa.model';
import { CacheManager } from './../../utils/nodeCache/cache';
import { HalaqaAttributes } from './../../interface/Halaqa/halaqaAttributes';

export default class HalaqaService extends BaseService<Halaqa> implements ICrudService<Halaqa, HalaqaCreationAttributes> {
    constructor() {
        super(Halaqa);
    }
    async checkHalaqaName(halaqaName: string): Promise<Halaqa | null> {
        const cacheKey = `halaqaName_${halaqaName}`;
        let halaqa = CacheManager.get<Halaqa>(cacheKey);
        if (!halaqa) {
            const halaqaInstance = await Halaqa.findOne({ where: { halaqaName } , attributes: ['id' , 'halaqaName'] });
            if (!halaqaInstance) return null;
            halaqa = halaqaInstance;
            CacheManager.set(cacheKey, halaqa);
        }
        return halaqa;
    }
    async create(halaqaData: HalaqaAttributes): Promise<Halaqa> {
        return await Halaqa.create(halaqaData);
    }
}
// async getHalaqatByCollege(CollegeName: string, gender: string): Promise<Halaqa[] | null> {
//     return await Halaqa.findAll({
//         where: { CollegeName, gender },
//         attributes: ['id', 'halaqaName', 'CollegeName', 'gender', [sequelize.fn('COUNT', sequelize.col('Students.id')), 'studentsCount']],
//         include: [{
//             model: User,
//             as: 'Supervisor',
//             attributes: ['id', 'fullName'],
//         },
//         {
//             model: User,
//             as: 'Students',
//             attributes: [],
//         }
//         ],
//         group: ['Halaqa.id', 'Supervisor.id']
//     });

// }
// async getHalaqaById(id: number): Promise<Halaqa | null> {
//     return await Halaqa.findByPk(id, {
//         attributes: ['id', 'halaqaName', 'CollegeName', 'gender'],
//         include: [
//             {
//                 model: User,
//                 as: 'Supervisor',
//                 attributes: ['id', 'fullName', 'phoneNumber']
//             },
//             {
//                 model: User,
//                 as: 'Students',
//                 attributes: ['id', 'fullName', 'phoneNumber']
//             }
//         ]
//     });
// }
// async checkHalaqa(id: number): Promise<Halaqa | null> {
//     return await Halaqa.findByPk(id);
// }
// async checkStudent(studentId: number): Promise<User | null> {
//     return await User.findByPk(studentId);
// }
// async deleteHalaqa(id: number) {
//     await User.update({ halaqaId: null }, { where: { halaqaId: id } });
//     return await Halaqa.destroy({ where: { id } });
// }
// async getSuperVisorsByCollege(CollegeName: string, gender: string): Promise<User[] | null> {
//     return await User.findAll({
//         where: {
//             CollegeName,
//             role: { [Op.in]: ['TasmeaHifzSupervisor', 'CollegeSupervisor' , 'TasmeaSupervisor'] },
//             gender,
//             status: 'Active'
//         },
//         include: [{
//             model: Halaqa,
//             as: 'SupervisedHalaqa',
//             attributes: ['id'],
//             required: false
//         }],
//         having: sequelize.where(sequelize.col('SupervisedHalaqa.id'), null),
//         attributes: ['id', 'fullName', 'role', 'gender', 'CollegeName']
//     });
// }
// async updateSuperVisorHalaqa(halaqaId: number, supervisorId: number): Promise<number> {
//     const [affectedRows] = await Halaqa.update(
//         { supervisorId: supervisorId },
//         { where: { id: halaqaId } }
//     );
//     return affectedRows;
// }
// async getStudentsWithoutHalaqa(CollegeName: string, gender: string): Promise<User[] | null> {
//     return await User.findAll({
//         where: { CollegeName, gender, halaqaId: null , status: 'Active' ,  role: { [Op.notIn]: ['Doctor', 'Admin'] }, },
//         attributes: ['id', 'fullName']
//     });
// }
// async updateStudentSupervisor(studentId: number, supervisorId: number): Promise<number> {
//     const [affectedRows] = await User.update(
//         { halaqaId: supervisorId },
//         { where: { id: studentId } }
//     );
//     return affectedRows;
// }

// async allStudentsByCollege(CollegeName: string, gender: string, role?: Roles, search?: string): Promise<User[]> {
//     const whereCondition: any = { CollegeName, gender , status: 'Active' };
//     if (role) {
//         whereCondition.role = role;
//     }
//     if (search) {
//         whereCondition.fullName = { [Op.like]: `%${search}%` };
//     }
//     return await User.findAll({ where: whereCondition  , attributes: ['id', 'fullName', 'role', 'gender', 'CollegeName'] });
// }
// async deleteUserFromHalaqa(studentId: number): Promise<number> {
//     const [affectedRows] = await User.update(
//         { halaqaId: null },
//         { where: { id: studentId } }
//     );
//     return affectedRows;
// }