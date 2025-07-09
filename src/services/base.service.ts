import { Model, ModelStatic } from "sequelize";

export abstract class BaseService<T extends Model<any, any>> {
  protected model: ModelStatic<T>;
  constructor(model: ModelStatic<T>) {
    this.model = model;
  }
   async checkId(id: number, attributes: string[] = []): Promise<T | null> {
    const selectedAttributes = attributes.length > 0 ? attributes : ['id'];
    return this.model.findByPk(id, { attributes: selectedAttributes });
  }
}
