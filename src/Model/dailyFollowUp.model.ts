import { DataTypes, Model } from 'sequelize';
import { sequelize } from './../config/DBconnection';
import User from './user.model';
import { dailyFollowUpAttributes, dailyFollowUpCreationAttributes } from './../interface/DailyFollowUp/dailyFollowUpAttributes';
import { BaseModel } from './base.model';

class DailyFollowUp extends BaseModel<dailyFollowUpAttributes ,dailyFollowUpCreationAttributes> implements dailyFollowUpAttributes {
    public ReviewInfo!: string;
    public savedInfo!: string;
    public note!: string;
    public date!: Date;
    public userId!: number;
    public pageNumberSaved!: number;
    public pageNumberReview!: number;
}

DailyFollowUp.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ReviewInfo: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    savedInfo: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    note: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    pageNumberSaved:{
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    pageNumberReview:{
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'DailyFollowUp',
    timestamps: true,
});

DailyFollowUp.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(DailyFollowUp, { foreignKey: 'userId', as: 'dailyFollowUps' });

export default DailyFollowUp;
