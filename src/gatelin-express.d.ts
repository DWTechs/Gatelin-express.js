import type { Request, Response, NextFunction } from 'express';

interface Consumer {
  userId: number;
  nickname: string;
}

declare function getConsumer(req: Request, res: Response, next: NextFunction): void;

export { 
  getConsumer,
  Consumer,
};


