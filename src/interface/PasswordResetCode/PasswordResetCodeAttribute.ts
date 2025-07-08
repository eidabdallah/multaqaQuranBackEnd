import { Optional } from 'sequelize';
import { BaseAttributes } from './../baseAttributes';
export interface PasswordResetCodeAttributes extends BaseAttributes {
  code: string;
  UserId: number;
}

export interface PasswordResetCodeCreationAttributes extends Optional<PasswordResetCodeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
