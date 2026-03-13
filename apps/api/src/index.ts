import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load .env file - silently does nothing if file doesn't exist (e.g. on Vercel)
dotenv.config();

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
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL, // Set this in Vercel env vars
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        // Allow any .vercel.app domain or listed origins
        if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(null, false);
    },
    credentials: true,
}));
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

// If not running in a Vercel Serverless environment, start the server locally
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Finance AI Backend running on port ${port}`);
    });
}

// Export the app for Vercel serverless functions
export default app;
