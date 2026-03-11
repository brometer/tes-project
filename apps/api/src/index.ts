import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import authRoutes from './routes/auth.routes';
import bankAccountRoutes from './routes/bank-accounts.routes';
import transactionRoutes from './routes/transactions.routes';
import budgetRoutes from './routes/budgets.routes';
import recurringRoutes from './routes/recurring.routes';
import reportRoutes from './routes/reports.routes';
import categoryRoutes from './routes/categories.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});

app.listen(port, () => {
    console.log(`Finance AI Backend running on port ${port}`);
});
