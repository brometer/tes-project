import { db } from '../db';
import { transactions, bankAccounts, categories } from '../db/schema';
import { eq, and, sql, gte, lte } from 'drizzle-orm';

export const getPeriodSummary = async (userId: string, month: number, year: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const result = await db.select({
        type: transactions.type,
        total: sql<number>`sum(${transactions.amount})`
    }).from(transactions).where(
        and(
            eq(transactions.userId, userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
        )
    ).groupBy(transactions.type);

    const summary = { income: 0, expense: 0, net: 0 };
    result.forEach(row => {
        if (row.type === 'income') summary.income = Number(row.total);
        if (row.type === 'expense') summary.expense = Number(row.total);
    });
    summary.net = summary.income - summary.expense;

    return summary;
};

export const getByBank = async (userId: string, month: number, year: number) => {
    // In a real app, this would use a more complex aggregate query.
    // Simplifying down to just fetching all accounts and their current balances as an approximation.
    return await db.select({
        id: bankAccounts.id,
        name: bankAccounts.name,
        color: bankAccounts.color,
        balance: bankAccounts.balance
    }).from(bankAccounts).where(
        and(eq(bankAccounts.userId, userId), eq(bankAccounts.isDeleted, false))
    );
};

export const getByCategory = async (userId: string, month: number, year: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const result = await db.select({
        categoryId: transactions.categoryId,
        categoryName: categories.name,
        total: sql<number>`sum(${transactions.amount})`
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
        and(
            eq(transactions.userId, userId),
            eq(transactions.type, 'expense'),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
        )
    )
    .groupBy(transactions.categoryId, categories.name);

    return result.map(r => ({
        ...r,
        total: Number(r.total)
    }));
};
