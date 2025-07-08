import { BaseModel } from "./base.model";
import { PasswordResetCodeAttributes, PasswordResetCodeCreationAttributes } from './../interface/PasswordResetCode/PasswordResetCodeAttribute';
import { DataTypes } from "sequelize";
import { sequelize } from './../config/DBconnection';

class PasswordResetCode extends BaseModel<PasswordResetCodeAttributes, PasswordResetCodeCreationAttributes> implements PasswordResetCodeAttributes {
  public code!: string;
  public UserId!: number;
}

PasswordResetCode.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'passwordResetCode',
  timestamps: true,
  indexes: [
    {
      unique: false,
      fields: ['UserId', 'code']
    }
  ]
});

export default PasswordResetCode;