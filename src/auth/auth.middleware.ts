import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { IMiddleware } from '../common/middleware.interface';
import { IConfigService } from '../config/config.service.interface';

export class AuthMiddleware implements IMiddleware {
    constructor(private configService: IConfigService) {}

    handler(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers.authorization?.split(' ')[1] || '';
        const accessSecret = this.configService.get('ACCESS_SECRET');
        verify(token, accessSecret, (err, payload) => {
            if (err || !payload || typeof payload === 'string') 
                return next();
                
            if (this.isAuthPayload(payload)) 
                req.user = payload;

            next();
        })
    }

    private isAuthPayload(payload: object): payload is Request['user'] {
        return 'username' in payload || 'email' in payload;
    }
}