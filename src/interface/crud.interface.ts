import { Request, Response, NextFunction } from 'express';
export interface ICrudService<T, CreateDto = Partial<T>> {
  create(data: CreateDto): Promise<T>;
}

export interface ICrudController<T, CreateDto = Partial<T>> {
  create(req: Request, res: Response, next: NextFunction): Promise<any>;
  get(req: Request, res: Response, next: NextFunction): Promise<any>;
}
