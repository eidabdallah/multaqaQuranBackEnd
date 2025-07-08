import { Optional } from "sequelize";
import { BaseAttributes } from './../baseAttributes';

export interface UserAttributes extends BaseAttributes {
  universityId: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  CollegeName: string;
  confirmEmail: boolean;
  halaqaId?: number | null;
  status: 'Active' | 'No_Active';
  gender: 'Male' | 'Female';
  role: 'Admin' | 'TasmeaHifzSupervisor' | 'TasmeaSupervisor' | 'Doctor' | 'Student' | 'CollegeSupervisor';
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}