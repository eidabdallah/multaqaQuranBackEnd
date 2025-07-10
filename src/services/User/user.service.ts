import { UserCreationAttributes } from '../../interface/User/userAttributes';
import { Roles } from '../../utils/enum/role.enum';
import { BaseService } from '../base.service';
import User from './../../Model/user.model';
import { ICrudService } from './../../interface/crud.interface';
import { CacheManager } from './../../utils/nodeCache/cache';
export default class UserService extends BaseService<User> implements ICrudService<User, UserCreationAttributes> {
    constructor() {
        super(User);
    }
    async checkPhoneNumber(phoneNumber: string): Promise<User | null> {
        const cacheKey = `user_phone_${phoneNumber}`;
        let user = CacheManager.get<User | null>(cacheKey);
        if (user !== undefined) return user;
        user = await User.findOne({ where: { phoneNumber }, attributes: ['phoneNumber'] });
        CacheManager.set(cacheKey, user);

        return user;
    }
    async update(id: number, data: Partial<UserCreationAttributes>): Promise<number> {
        const [affectedCount] = await User.update(data, { where: { id } });
        if (affectedCount > 0) {
            CacheManager.del(`user_phone_${data.phoneNumber}`);
        }
        return affectedCount;
    }
    async changeRoleStudent(studentId: number, role: Roles): Promise<number> {
        const [affectedRows] = await User.update({ role }, { where: { id: studentId } });
        return affectedRows;
    }
}
