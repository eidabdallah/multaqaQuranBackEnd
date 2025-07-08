import { DataTypes, Model } from 'sequelize';
import { sequelize } from './../config/DBconnection';
import User from './user.model';
import { BaseModel } from './base.model';
import { ExamRequestAttributes, ExamRequestCreationAttributes } from './../interface/ExamRequest/examRequestAttributes';


class ExamRequest extends BaseModel<ExamRequestAttributes , ExamRequestCreationAttributes> implements ExamRequestAttributes {
    public StudentId!: number;
    public SupervisorId!: number;
    public examType!: 'تجريبي' | 'رسمي';
    public timeExam!: string;
    public date!: string;
    public status!: "انتظار" | "تاكيد" | "رفض";
    public parts!: string;
    public examPattern!: 'تثبيت' | 'عادي';
}

ExamRequest.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    StudentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    SupervisorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    examType: {
        type: DataTypes.ENUM('تجريبي', 'رسمي'),
        allowNull: false,
    },
    timeExam: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('انتظار', 'تاكيد', 'رفض'),
        defaultValue: 'انتظار'
    },
    parts: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    examPattern: {
        type: DataTypes.ENUM('تثبيت', 'عادي'),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'examRequest',
    timestamps: true,
});

ExamRequest.belongsTo(User, { foreignKey: 'StudentId', as: 'student' });
User.hasMany(ExamRequest, { foreignKey: 'StudentId', as: 'examRequests' });

export default ExamRequest;
