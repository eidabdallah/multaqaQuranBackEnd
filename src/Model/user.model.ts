import { DataTypes } from 'sequelize';
import { BaseModel } from './base.model';
import { sequelize } from '../config/DBconnection';
import { UserAttributes, UserCreationAttributes } from '../interface/User/userAttributes';
import PasswordResetCode from './passwordResetCode.model.js';

class User extends BaseModel<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public universityId!: string;
  public fullName!: string;
  public password!: string;
  public phoneNumber!: string;
  public CollegeName!: string;
  public confirmEmail!: boolean;
  public halaqaId?: number | null | undefined;
  public status!: 'Active' | 'No_Active';
  public gender!: 'Male' | 'Female';
  public role!: 'Admin' | 'TasmeaHifzSupervisor' | 'TasmeaSupervisor' | 'Doctor' | 'Student' | 'CollegeSupervisor';
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  universityId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  CollegeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  confirmEmail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('Active', 'No_Active'),
    defaultValue: 'No_Active',
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female'),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'TasmeaHifzSupervisor', 'TasmeaSupervisor', 'Doctor', 'Student', 'CollegeSupervisor'),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
  indexes: [
  { fields: ['CollegeName'] },
  { fields: ['role'] },
  { fields: ['gender'] },
  { fields: ['status'] },
]
});

User.hasOne(PasswordResetCode, { onDelete: 'CASCADE' });
PasswordResetCode.belongsTo(User, { onDelete: 'CASCADE' });

export default User;
