import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize( process.env.DB_NAME as string , process.env.DB_USER as string, process.env.DB_PASSWORD as string, {
    host: process.env.DB_HOST || "localhost",
    dialect: 'mysql',
    logging: false,
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter : false});
        console.log('✅ Database connected successfully...');

    } catch (error) {
        console.log(`❌ Error connecting to the database : ${error}`);
    }
};
