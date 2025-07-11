import { dailyFollowUpCreationAttributes } from "../../interface/DailyFollowUp/dailyFollowUpAttributes";
import DailyFollowUp from "../../Model/dailyFollowUp.model";
import { BaseService } from "../base.service";
import { ICrudService } from './../../interface/crud.interface';
import { CacheManager } from './../../utils/nodeCache/cache';

export default class DailyFollowUpService extends BaseService<DailyFollowUp> implements ICrudService<DailyFollowUp, dailyFollowUpCreationAttributes> {
    constructor() {
        super(DailyFollowUp);
    }
    async create(data: dailyFollowUpCreationAttributes) {
        const result = await DailyFollowUp.create(data);
        CacheManager.del(`dailyFollowUp_${data.userId}`);
        return result;
    }

}
