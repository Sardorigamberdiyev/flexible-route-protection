import { Request, Response, NextFunction } from 'express';

export interface IUsersController {
    getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    userBanned(req: Request, res: Response, next: NextFunction): Promise<void>;
}