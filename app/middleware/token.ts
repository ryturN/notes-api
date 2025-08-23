import jsonwebtoken, { decode } from 'jsonwebtoken' 
import type { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const jwt_secret = process.env.JWT_SECRET

interface AuthOptions {
  tokenSource?: 'header' | 'cookies' | 'both';
  onTokenExtracted?: (token: string, source: 'header' | 'cookies') => void;
}

const authMiddleware = (options: AuthOptions = {}) => {
    const { tokenSource = 'both', onTokenExtracted } = options;
    
    return async (req: Request, res: Response, next: NextFunction) => {
        let token: string | undefined;
        let source: 'header' | 'cookies' | undefined;

        if (tokenSource === 'header' || tokenSource === 'both') {
        const headerToken = req.header('Authorization')?.replace('Bearer ', '');
        if (headerToken) {
            token = headerToken;
            source = 'header';
        }
        }
        if (!token && (tokenSource === 'cookies' || tokenSource === 'both')) {
        const cookieToken = req.cookies.accessToken;
        if (cookieToken) {
            token = cookieToken;
            source = 'cookies';
        }
        }

        if (token && source && onTokenExtracted) {
        onTokenExtracted(token, source);
        }

        if (!token) {
        return res.status(401).json({ 
            message: 'Access token is required',
            hint: 'Provide token via Authorization header or cookies'
        });
        }

        jsonwebtoken.verify(token as string, jwt_secret as string, (err: unknown, decoded: any) => {
        if (err instanceof jsonwebtoken.TokenExpiredError) {
            return res.status(401).json({ 
              message: 'Token expired', 
              code: 'TOKEN_EXPIRED',
              source: source 
            });
        }
        
        if (err instanceof jsonwebtoken.JsonWebTokenError) {
            return res.status(401).json({ 
              message: 'Invalid token',
              source: source
            });
        }
        
        req.user = decoded;
        next();
        });
    };
};

export default authMiddleware;

export const headerOnlyAuth = authMiddleware({ tokenSource: 'header' });
export const cookiesOnlyAuth = authMiddleware({ tokenSource: 'cookies' });
export const flexibleAuth = authMiddleware({ 
  tokenSource: 'both',
  onTokenExtracted: (token, source) => {
    console.log(`Token received from ${source}`);
  }
});