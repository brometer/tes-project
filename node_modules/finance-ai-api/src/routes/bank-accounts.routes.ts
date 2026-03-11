import { Router } from 'express';
import * as bankAccountsService from '../services/bank-accounts.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const accounts = await bankAccountsService.findByUserId(userId);
        res.json(accounts);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const account = await bankAccountsService.findById(req.params.id, userId);
        if (!account) return res.status(404).json({ error: "Not found" });
        res.json(account);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const account = await bankAccountsService.create(userId, req.body);
        res.status(201).json(account);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const account = await bankAccountsService.update(req.params.id, userId, req.body);
        res.json(account);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        await bankAccountsService.softDelete(req.params.id, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
