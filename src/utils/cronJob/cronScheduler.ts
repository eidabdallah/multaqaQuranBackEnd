import PasswordResetCodeCleaner from './passwordResetCodeCleaner';
import UnconfirmedAccountCleaner from './unconfirmedAccountCleaner';
export default class CronJobManager {
  static register() {
    new PasswordResetCodeCleaner().start();
    new UnconfirmedAccountCleaner().start();
  }
}
