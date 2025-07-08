
import User from './../../Model/user.model';
import { BaseCronJob } from './baseCronJob';

export default class UnconfirmedAccountCleaner extends BaseCronJob {
  schedule = '0 0 */21 * *';

  async task() {
    await User.destroy({
      where: { confirmEmail: false },
    });
  }
}
