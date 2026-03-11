import { getByBank, getByCategory } from './reports.service';
import { findByMonth } from './budgets.service';
import { db } from '../db';
import { transactions, bankAccounts } from '../db/schema';
import { eq, desc, and, gte } from 'drizzle-orm';

export const getDashboardData = async (userId: string) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // 1. Bank Accounts & Total
    const accounts = await getByBank(userId, currentMonth, currentYear);
    const totalBalance = accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);

    // 2. Spending by Category
    const spendingByCategory = await getByCategory(userId, currentMonth, currentYear);

    // 3. Budgets (for alerts)
    const activeBudgets = await findByMonth(userId, currentMonth, currentYear);
    const budgetAlerts = activeBudgets.filter((b: any) => b.percentage >= 50).sort((a: any, b: any) => b.percentage - a.percentage); // Only show ones nearing/over limit

    // 4. Recent Transactions (last 5)
    const recentTransactions = await db.select({
        id: transactions.id,
        amount: transactions.amount,
        type: transactions.type,
        category: transactions.categoryId,
        description: transactions.description,
        date: transactions.date,
        bank: bankAccounts.name
    })
    .from(transactions)
    .leftJoin(bankAccounts, eq(transactions.bankAccountId, bankAccounts.id))
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date))
    .limit(5);

    // 5. Balance Trend (last 6 days)
    const trendDays = 6;
    const trendStartDate = new Date(today);
    trendStartDate.setDate(today.getDate() - trendDays + 1);
    trendStartDate.setHours(0, 0, 0, 0);

    const recentTx = await db.select({
        amount: transactions.amount,
        type: transactions.type,
        date: transactions.date
    }).from(transactions)
      .where(and(eq(transactions.userId, userId), gte(transactions.date, trendStartDate)));

    const dailyNet = new Map<string, number>();
    for (let i = 0; i < trendDays; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dailyNet.set(d.toDateString(), 0);
    }

    recentTx.forEach(tx => {
        const dateStr = tx.date.toDateString();
        if (dailyNet.has(dateStr)) {
            const net = tx.type === 'income' ? tx.amount : -tx.amount;
            dailyNet.set(dateStr, dailyNet.get(dateStr)! + net);
        }
    });

    let runningBalance = totalBalance;
    const balanceTrend = [];
    for (let i = 0; i < trendDays; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toDateString();
        
        balanceTrend.unshift({
            date: dateStr,
            dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
            balance: runningBalance
        });

        runningBalance -= dailyNet.get(dateStr) || 0;
    }

    return {
        accounts,
        totalBalance,
        spendingByCategory,
        budgetAlerts,
        recentTransactions,
        balanceTrend
    };
};
