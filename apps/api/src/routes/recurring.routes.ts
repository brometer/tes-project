import { Router } from 'express';
import * as recurringService from '../services/recurring.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const items = await recurringService.findAll(userId);
        res.json(items);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const item = await recurringService.create(userId, req.body);
        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const item = await recurringService.update(req.params.id, userId, req.body);
        res.json(item);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/toggle', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const item = await recurringService.toggleActive(req.params.id, userId);
        res.json(item);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        await recurringService.remove(req.params.id, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
