import { Router } from 'express';
import * as transactionsService from '../services/transactions.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const { bankId, categoryId, month, year } = req.query;
        const filters = {
            bankId: bankId as string,
            categoryId: categoryId as string,
            month: month ? parseInt(month as string) : undefined,
            year: year ? parseInt(year as string) : undefined
        };
        const items = await transactionsService.findAll(userId, filters);
        res.json(items);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const item = await transactionsService.findById(req.params.id, userId);
        if (!item) return res.status(404).json({ error: "Not found" });
        res.json(item);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const item = await transactionsService.create(userId, req.body);
        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        await transactionsService.remove(req.params.id, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
