import { Optional } from "sequelize";
import { BaseAttributes } from "../baseAttributes";

export interface dailyFollowUpAttributes extends BaseAttributes {
    ReviewInfo: string;
    savedInfo: string;
    note: string;
    date: Date;
    userId: number;
    pageNumberSaved: number;
    pageNumberReview: number
}

export interface dailyFollowUpCreationAttributes extends Optional<dailyFollowUpAttributes, 'id' | 'createdAt' | 'updatedAt'> { }
