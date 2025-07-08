import { Optional } from "sequelize";
import { BaseAttributes } from "../baseAttributes";

export interface HalaqaAttributes extends BaseAttributes {
  halaqaName: string;
  supervisorId: number;
  collegeName: string;
  gender: 'Male' | 'Female';
}

export interface HalaqaCreationAttributes extends Optional<HalaqaAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
