import { DataTypes, Model } from 'sequelize';
import { sequelize } from './../config/DBconnection';
import User from './user.model';
import { ExamAttributes, ExamCreationAttributes } from './../interface/Exam/examAttributes';
import { BaseModel } from './base.model';

class Exam extends BaseModel<ExamAttributes , ExamCreationAttributes> implements ExamAttributes {
    public StudentId!: number;
    public SupervisorId!: number;
    public examType!: 'تجريبي' | 'رسمي';
    public timeExam!: string;
    public date!: string;
    public parts!: string;
    public examPattern!: 'تثبيت' | 'عادي';
    public grade!: number;
    public statusGrade!: 'راسب' | 'ناجح';
}

Exam.init({
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
        allowNull: true,
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
    parts: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    examPattern: {
        type: DataTypes.ENUM('تثبيت', 'عادي'),
        allowNull: false,
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    statusGrade: {
        type: DataTypes.ENUM('راسب', 'ناجح'),
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'exam',
    timestamps: true,
});

Exam.belongsTo(User, { foreignKey: 'StudentId', as: 'student' });
Exam.belongsTo(User, { foreignKey: 'SupervisorId', as: 'supervisor' });
User.hasMany(Exam, { foreignKey: 'StudentId', as: 'studentExams' });
User.hasMany(Exam, { foreignKey: 'SupervisorId', as: 'supervisorExams' });

export default Exam;
