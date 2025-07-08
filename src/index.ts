import express, { Application } from "express";
import 'dotenv/config'
import AppInitializer from './app.router';

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

 const initializer = new AppInitializer(app, express);
initializer.init();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});