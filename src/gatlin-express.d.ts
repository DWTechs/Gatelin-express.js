import type { Request, Response, NextFunction } from 'express';

declare function getConsumer(req: Request, res: Response, next: NextFunction): Promise<void>;

export { 
  getConsumer,
};


