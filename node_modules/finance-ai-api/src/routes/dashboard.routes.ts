import { Router } from 'express';
import { getDashboardData } from '../services/dashboard.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const data = await getDashboardData(userId);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

export default router;
