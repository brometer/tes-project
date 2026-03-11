import { db } from '../db';
import { budgets, transactions } from '../db/schema';
import { eq, and, sql, gte, lte } from 'drizzle-orm';

export const findByMonth = async (userId: string, month: number, year: number) => {
    // Basic left join to get spent amount 
    // In a production app, a dedicated view or raw SQL with GROUP BY is cleaner here
    const budgetList = await db.select().from(budgets).where(
        and(eq(budgets.userId, userId), eq(budgets.month, month), eq(budgets.year, year))
    );

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Fetch transactions for this month for these categories
    const relevantTransactions = await db.select({
        categoryId: transactions.categoryId,
        total: sql<number>`sum(${transactions.amount})`
    }).from(transactions).where(
        and(
            eq(transactions.userId, userId),
            eq(transactions.type, 'expense'),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
        )
    ).groupBy(transactions.categoryId);

    // Merge spent data
    return budgetList.map((b: any) => {
        const spentMatch = relevantTransactions.find((t: any) => t.categoryId === b.categoryId);
        const spent = spentMatch ? Number(spentMatch.total) : 0;
        return {
            ...b,
            spent,
            remaining: b.limitAmount - spent,
            percentage: (spent / b.limitAmount) * 100
        };
    });
};

export const create = async (userId: string, data: { categoryId: string, limitAmount: number, month: number, year: number }) => {
    const [result] = await db.insert(budgets).values({ ...data, userId }).returning();
    return result;
};

export const update = async (id: string, userId: string, limitAmount: number) => {
    const [result] = await db.update(budgets).set({ limitAmount, updatedAt: new Date() }).where(
        and(eq(budgets.id, id), eq(budgets.userId, userId))
    ).returning();
    return result;
};
