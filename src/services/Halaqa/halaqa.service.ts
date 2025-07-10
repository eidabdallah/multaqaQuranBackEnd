import { BaseService } from '../base.service';
import { HalaqaCreationAttributes } from '../../interface/Halaqa/halaqaAttributes';
import { ICrudService } from './../../interface/crud.interface';
import Halaqa from './../../Model/halaqa.model';
import { CacheManager } from './../../utils/nodeCache/cache';
import { HalaqaAttributes } from './../../interface/Halaqa/halaqaAttributes';
import User from './../../Model/user.model';
import { Op } from 'sequelize';
import sequelize from 'sequelize';

export default class HalaqaService extends BaseService<Halaqa> implements ICrudService<Halaqa, HalaqaCreationAttributes> {
    constructor() {
        super(Halaqa);
    }
    async checkHalaqaName(halaqaName: string): Promise<Halaqa | null> {
        const cacheKey = `halaqaName_${halaqaName}`;
        let halaqa = CacheManager.get<Halaqa>(cacheKey);
        if (!halaqa) {
            const halaqaInstance = await Halaqa.findOne({ where: { halaqaName }, attributes: ['id', 'halaqaName'] });
            if (!halaqaInstance) return null;
            halaqa = halaqaInstance;
            CacheManager.set(cacheKey, halaqa);
        }
        return halaqa;
    }
    async create(halaqaData: HalaqaAttributes): Promise<Halaqa> {
        return await Halaqa.create(halaqaData);
    }
    async get(criteria: Partial<Halaqa>): Promise<Halaqa[] | null> {
        return await Halaqa.findAll({ where: criteria });
    }
    async getOne(id: number): Promise<Halaqa | null> {
        const cacheKey = `halaqa_${id}`;
        let halaqa = CacheManager.get<Halaqa>(cacheKey);
        if (!halaqa) {
            const halaqaInstance = await Halaqa.findByPk(id);
            if (!halaqaInstance) return null;
            halaqa = halaqaInstance;
            CacheManager.set(cacheKey, halaqa);
        }
        return halaqa;
    }
    async delete(id: number): Promise<number> {
        const deleted = await Halaqa.destroy({ where: { id } });
        if (deleted > 0) {
            CacheManager.del(`halaqa_${id}`);
        }
        return deleted;
    }
    async getSuperVisorsByCollege(CollegeName: string, gender: string): Promise<User[] | null> {
        const cacheKey = `supervisors_${CollegeName}_${gender}`;
        let supervisors = CacheManager.get<User[]>(cacheKey);
        if (supervisors) {
            return supervisors;
        }
        supervisors = await User.findAll({
            where: {
                CollegeName,
                role: { [Op.in]: ['TasmeaHifzSupervisor', 'CollegeSupervisor', 'TasmeaSupervisor'] },
                gender,
                status: 'Active'
            },
            include: [{
                model: Halaqa,
                as: 'SupervisedHalaqa',
                attributes: ['id'],
                required: false,
                where: { id: { [Op.is]: null } }
            }],
            attributes: ['id', 'fullName', 'role', 'gender', 'CollegeName']
        });
        CacheManager.set(cacheKey, supervisors);
        return supervisors;
    }
    async checkSupervisorHaveHalaqa(supervisorId: number): Promise<Halaqa | null> {
        return await Halaqa.findOne({ where: { supervisorId } });
    }
    async update(id: number, data: Partial<Halaqa>): Promise<number> {
        const [affectedCount] = await Halaqa.update(data, { where: { id } });
        return affectedCount;
    }
}