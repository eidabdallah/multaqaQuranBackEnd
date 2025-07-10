import { BaseService } from "../base.service";
import User from './../../Model/user.model';
import { ICrudService } from './../../interface/crud.interface';
import { CacheManager } from './../../utils/nodeCache/cache';
import  bcrypt  from 'bcryptjs';
import { UserCreationAttributes } from "../../interface/User/userAttributes.js";

export default class AdminService extends BaseService<User> implements ICrudService<User, UserCreationAttributes> {
    async get(): Promise<User[] | null> {
        return await User.findAll({
            where: { status: 'No_Active', role: 'Student' },
            attributes: ['id', 'universityId', 'fullName', 'status', 'phoneNumber', 'CollegeName', 'role', 'confirmEmail']
        });
    }
    async checkUniversity(id: number): Promise<User | null> {
        return await User.findByPk(id);
    }
     async checkPhoneNumber(phoneNumber: string): Promise<User | null> {
        const cacheKey = `user_phone_${phoneNumber}`;
        let user = CacheManager.get<User | null>(cacheKey);
        if (user !== undefined) return user;
        user = await User.findOne({ where: { phoneNumber }, attributes: ['phoneNumber'] });
        CacheManager.set(cacheKey, user);

        return user;
    }
    async create(userData : UserCreationAttributes): Promise<User> {
        userData.password = await bcrypt.hash(userData.password, +process.env.SALT_ROUNDS!);
        return await User.create({ ...userData, confirmEmail: true , status: 'Active' });
    }
}