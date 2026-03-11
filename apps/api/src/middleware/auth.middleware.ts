import { Request, Response, NextFunction } from 'express';
import { auth } from '../auth';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const headers = new Headers(req.headers as any);

        const session = await auth.api.getSession({
            headers
        });

        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        (req as any).user = session.user;

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};