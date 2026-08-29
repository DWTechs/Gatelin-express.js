import type { Request, Response, NextFunction } from 'express';

interface Consumer {
  userId: number;
  nickname: string;
}

interface AclCondition {
  field: string;
  op: string;
  value: string | number | boolean;
}

interface Acl {
  fields: Set<string> | null;
  conditions: AclCondition[];
}

declare function getConsumer(req: Request, res: Response, next: NextFunction): void;
declare function getAcl(req: Request, res: Response, next: NextFunction): void;
declare function stripUnallowedFields(req: Request, res: Response, next: NextFunction): void;

export { 
  getConsumer,
  getAcl,
  stripUnallowedFields,
  Consumer,
  Acl,
  AclCondition,
};


