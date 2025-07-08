import { Model } from 'sequelize';

export abstract class BaseModel<TAttributes extends {}, TCreationAttributes extends {}> extends Model<TAttributes, TCreationAttributes> {
  public id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
