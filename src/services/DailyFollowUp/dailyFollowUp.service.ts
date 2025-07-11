import { dailyFollowUpCreationAttributes } from "../../interface/DailyFollowUp/dailyFollowUpAttributes";
import DailyFollowUp from "../../Model/dailyFollowUp.model";
import { BaseService } from "../base.service";
import { ICrudService } from './../../interface/crud.interface';
import { CacheManager } from './../../utils/nodeCache/cache';

export default class DailyFollowUpService extends BaseService<DailyFollowUp> implements ICrudService<DailyFollowUp, dailyFollowUpCreationAttributes> {
    constructor() {
        super(DailyFollowUp);
    }
    async create(data: dailyFollowUpCreationAttributes) : Promise<DailyFollowUp> {
        const result = await DailyFollowUp.create(data);
        CacheManager.del(`dailyFollowUp_${data.userId}`);
        return result;
    }
    async update(id: number, data: Partial<DailyFollowUp>): Promise<number> {
        const [affectedCount] = await DailyFollowUp.update(data, { where: { id } });
        if (affectedCount > 0) {
            CacheManager.del(`dailyFollowUp_${data.userId}`);
        }
        return affectedCount;
    }
    async delete(id: number): Promise<number> {
        const deleted = await DailyFollowUp.destroy({ where: { id } });
        if (deleted > 0) {
            CacheManager.del(`dailyFollowUp_${id}`);
        }
        return deleted;
    }

}
