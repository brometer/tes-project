import { Router } from 'express';
import * as categoriesService from '../services/categories.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const items = await categoriesService.findAll(userId);
        res.json(items);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const item = await categoriesService.create(userId, req.body);
        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        await categoriesService.remove(req.params.id, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
