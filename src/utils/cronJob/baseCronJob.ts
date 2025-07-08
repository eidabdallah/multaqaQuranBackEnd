import cron from 'node-cron';

export abstract class BaseCronJob {
  abstract schedule: string;
  abstract task(): Promise<void>;

  start() {
    cron.schedule(this.schedule, async () => {
      try {
        await this.task();
        console.log(`${this.constructor.name} executed successfully.`);
      } catch (error) {
        console.error(`${this.constructor.name} failed:`, error);
      }
    });
  }
}