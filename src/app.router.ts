import { Application, Request, Response } from "express";
import {connectDB} from "./config/DBconnection";
import NotFoundMiddleware from './utils/errorHandling/NotFound';
import CronJobManager from './utils/cronJob/cronScheduler';
import MiddlewareSetup from './utils/middlewareCore/setUpMiddleware';
import ErrorMiddleware from './utils/errorHandling/Error';
import authRoutes from './routes/auth.routes'
export default class AppInitializer {
  private app: Application;
  private expressLib: typeof import('express');

  constructor(app: Application, expressLib: typeof import('express')) {
    this.app = app;
    this.expressLib = expressLib;
  }

  public init(): void {
    this.app.use(this.expressLib.json());
    connectDB();
    MiddlewareSetup.setup(this.app);
    CronJobManager.register();

    this.app.get('/', (req: Request, res: Response) => {
      res.json({ message: 'اهلا بك في ملتقى القران الكريم جنة النجاح' });
    });
    this.app.use('/auth', authRoutes);


    this.app.use(NotFoundMiddleware.notFound);
    this.app.use(ErrorMiddleware.handle);
  }
}

// import authRoutes from './routes/auth.route'
// import userRoutes from './routes/user.route'
// import halaqaRoutes from './routes/halaqa.route'
// import adminRouter from './routes/admin.route'
// import DailyFollowUpRoutes from './routes/DailyFollowUp.route'
// import ExamRequestRoutes from './routes/ExamRequest.route'
// import ExamRoutes from './routes/Exam.route'import MiddlewareSetup from './utils/setUpMiddleware';


