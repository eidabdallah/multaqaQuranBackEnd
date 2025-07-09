import { UserCreationAttributes } from '../../interface/User/userAttributes';
import { Roles } from '../../utils/enum/role.enum';
import { BaseService } from '../base.service';
import User from './../../Model/user.model';
import { ICrudService } from './../../interface/crud.interface';
export default class UserService extends BaseService<User> implements ICrudService<User, UserCreationAttributes>{
     constructor() {
        super(User);
    }
    async checkPhoneNumber(phoneNumber: string) : Promise<User | null> {
        return await User.findOne({ where: { phoneNumber } });
    }
    async update(id: number, data: Partial<UserCreationAttributes>) : Promise<number> {
        const [affectedCount] = await User.update(data, { where: { id } });
        return affectedCount;
    } 
    async changeRoleStudent(studentId: number, role: Roles): Promise<number> {
        const [affectedRows] = await User.update({ role }, { where: { id: studentId } });
        return affectedRows;
    }
}
