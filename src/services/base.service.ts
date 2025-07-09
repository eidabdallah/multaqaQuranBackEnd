import { Model, ModelStatic } from "sequelize";
import { CacheManager } from './../utils/nodeCache/cache';
import { UserAttributes } from './../interface/User/userAttributes';

export abstract class BaseService<T extends Model<any, any>> {
  protected model: ModelStatic<T>;
  constructor(model: ModelStatic<T>) {
    this.model = model;
  }
  // for method need update the data
  async checkId(id: number, attributes: string[] = []): Promise<T | null> {
    const selectedAttributes = attributes.length > 0 ? attributes : ['id'];
    return this.model.findByPk(id, { attributes: selectedAttributes });
  }
  // for method need read only the data
  async checkIdWithCache(id: number): Promise<T | null> {
    const cacheKey = `user_${id}`;
    let cachedData = CacheManager.get<any>(cacheKey);
    if (!cachedData) {
      const modelInstance = await this.model.findByPk(id, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });
      if (modelInstance) {
        CacheManager.set(cacheKey, modelInstance.get({ plain: true }));
      }
      return modelInstance;
    }
    return this.model.build(cachedData, { isNewRecord: false });
  }

}
