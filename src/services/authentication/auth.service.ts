import { BaseService } from '../base.service';
import User from './../../Model/user.model';
import { UserAttributes, UserCreationAttributes } from '../../interface/User/userAttributes';
import bcrypt from 'bcryptjs';
import PasswordResetCode from './../../Model/passwordResetCode.model';
import { ICrudService } from './../../interface/crud.interface';

export default class AuthService extends BaseService<User> implements ICrudService<User, UserCreationAttributes> {
    constructor() {
        super(User);
    }
    async checkUniversityId(id: string, attributes: string[] = []): Promise<User | null> {
        return await User.findOne({
            where: { universityId: id },
            attributes: attributes.length ? attributes : ['id'],
        });
    }
    async validatePassword(plain: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(plain, hash);
    }
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, +process.env.SALT_ROUNDS!);
    }
    async create(userData: UserCreationAttributes): Promise<User> {
        userData.password = await this.hashPassword(userData.password);
        userData.role = "Student";
        return await this.model.create(userData);
    }
    async SaveCode(id: number, code: string) {
        await PasswordResetCode.create({ UserId: id, code });
    }
    async checkCode(id: number, code: string) {
        return await PasswordResetCode.findOne({ where: { UserId: id, code } });
    }
    async deleteCode(id: number, code: string) {
        await PasswordResetCode.destroy({ where: { UserId: id, code } });
    }
}

