import { Request, Response, NextFunction } from 'express';
export interface ICrudService<T, CreateDto = Partial<T>> {
  create?(data: CreateDto): Promise<T>;
  get?(data: Partial<T>): Promise<T[] | null>;
  getOne?(id: number): Promise<T | null>;
  update?(id: number, data: CreateDto): Promise<number>;
  delete?(id: number): Promise<number>;
}

export interface ICrudController<T> {
  create?(req: Request, res: Response, next: NextFunction): Promise<any>;
  get?(req: Request, res: Response, next: NextFunction): Promise<any>;
  getOne?(req: Request, res: Response, next: NextFunction): Promise<any>;
  update?(req: Request, res: Response, next: NextFunction): Promise<any>;
  delete?(req: Request, res: Response, next: NextFunction): Promise<any>;
}
