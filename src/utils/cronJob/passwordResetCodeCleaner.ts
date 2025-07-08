import { BaseCronJob } from './baseCronJob';
import PasswordResetCode from './../../Model/passwordResetCode.model';

export default class PasswordResetCodeCleaner extends BaseCronJob {
  schedule = '0 0 */15 * *';

  async task() {
    await PasswordResetCode.destroy({ truncate: true });
  }
}
