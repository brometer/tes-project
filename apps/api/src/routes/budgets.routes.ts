import { Router } from 'express';
import * as budgetsService from '../services/budgets.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        
        const items = await budgetsService.findByMonth(userId, month, year);
        res.json(items);
    } catch (error) {
        next(error);
    }
});

router.get('/summary', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        
        const items = await budgetsService.findByMonth(userId, month, year);
        
        const totalLimit = items.reduce((sum, b) => sum + b.limitAmount, 0);
        const totalSpent = items.reduce((sum, b) => sum + b.spent, 0);
        const totalRemaining = totalLimit - totalSpent;
        
        res.json({
            totalLimit,
            totalSpent,
            totalRemaining,
            percentage: totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0
        });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const item = await budgetsService.create(userId, req.body);
        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const item = await budgetsService.update(req.params.id, userId, req.body.limitAmount);
        res.json(item);
    } catch (error) {
        next(error);
    }
});

export default router;
