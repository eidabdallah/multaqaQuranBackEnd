import { DataTypes } from 'sequelize';
import { sequelize } from './../config/DBconnection';
import { BaseModel } from './base.model';
import User from './user.model';
import { HalaqaAttributes, HalaqaCreationAttributes } from './../interface/Halaqa/halaqaAttributes';


class Halaqa extends BaseModel<HalaqaAttributes, HalaqaCreationAttributes> implements HalaqaAttributes {
  public halaqaName!: string;
  public supervisorId!: number;
  public collegeName!: string;
  public gender!: 'Male' | 'Female';
}

Halaqa.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  halaqaName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  collegeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  supervisorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female'),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'halaqa',
  timestamps: true,
});

Halaqa.hasMany(User, { foreignKey: 'halaqaId', as: 'Students' });
User.belongsTo(Halaqa, { foreignKey: 'halaqaId', as: 'Halaqa' });
Halaqa.belongsTo(User, { foreignKey: 'supervisorId', as: 'Supervisor' });
User.hasOne(Halaqa, { foreignKey: 'supervisorId', as: 'SupervisedHalaqa' });

export default Halaqa;
