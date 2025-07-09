import { UserAttributes } from './../../interface/User/userAttributes';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserAttributes;
  }
}
