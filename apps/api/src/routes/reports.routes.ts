import { Router } from 'express';
import * as reportsService from '../services/reports.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
router.use(requireAuth);

router.get('/summary', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        
        const summary = await reportsService.getPeriodSummary(userId, month, year);
        res.json(summary);
    } catch (error) {
        next(error);
    }
});

router.get('/by-bank', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        
        const data = await reportsService.getByBank(userId, month, year);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/by-category', async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        
        const data = await reportsService.getByCategory(userId, month, year);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Mock export endpoints for now
router.get('/export/csv', async (req, res, next) => {
    res.attachment('export.csv').send('mock,csv,data');
});

router.get('/export/pdf', async (req, res, next) => {
    res.attachment('export.pdf').send('%PDF-mock');
});

export default router;
