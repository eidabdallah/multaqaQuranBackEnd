import helmet from 'helmet';

export default class SecurityMiddleware {
    static helmetSecurity  = helmet({
        xFrameOptions: { action: 'deny' }
    });
}
