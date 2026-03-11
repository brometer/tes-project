import { db } from '../db';
import { transactions, bankAccounts } from '../db/schema';
import { eq, and, sql, desc, gte, lte } from 'drizzle-orm';

export const findAll = async (userId: string, filters?: { bankId?: string, categoryId?: string, month?: number, year?: number }) => {
    let conditions = [eq(transactions.userId, userId)];
    
    if (filters?.bankId) conditions.push(eq(transactions.bankAccountId, filters.bankId));
    if (filters?.categoryId) conditions.push(eq(transactions.categoryId, filters.categoryId));
    if (filters?.month && filters?.year) {
        const startDate = new Date(filters.year, filters.month - 1, 1);
        const endDate = new Date(filters.year, filters.month, 0);
        conditions.push(gte(transactions.date, startDate));
        conditions.push(lte(transactions.date, endDate));
    }

    return await db.select().from(transactions).where(and(...conditions)).orderBy(desc(transactions.date));
};

export const findById = async (id: string, userId: string) => {
    const result = await db.select().from(transactions).where(
        and(eq(transactions.id, id), eq(transactions.userId, userId))
    );
    return result[0];
};

export const create = async (userId: string, data: any) => {
    return await db.transaction(async (tx: any) => {
        // Create the transaction
        const [newTx] = await tx.insert(transactions).values({
            userId,
            bankAccountId: data.bankAccountId,
            categoryId: data.categoryId,
            type: data.type,
            amount: data.amount,
            description: data.description,
            date: new Date(data.date),
        }).returning();

        // Update bank account balance
        // If income, add to balance. If expense, subtract.
        const balanceChange = data.type === 'income' ? data.amount : -data.amount;
        
        await tx.update(bankAccounts).set({
            balance: sql`${bankAccounts.balance} + ${balanceChange}`,
            updatedAt: new Date()
        }).where(eq(bankAccounts.id, data.bankAccountId));

        return newTx;
    });
};

export const remove = async (id: string, userId: string) => {
    return await db.transaction(async (tx: any) => {
        // Find existing to know how to adjust balance
        const [existing] = await tx.select().from(transactions).where(
            and(eq(transactions.id, id), eq(transactions.userId, userId))
        );
        
        if (!existing) throw new Error("Transaction not found");

        // Revert balance
        const balanceChange = existing.type === 'income' ? -existing.amount : existing.amount;
        await tx.update(bankAccounts).set({
            balance: sql`${bankAccounts.balance} + ${balanceChange}`,
            updatedAt: new Date()
        }).where(eq(bankAccounts.id, existing.bankAccountId));

        // Delete
        const [deleted] = await tx.delete(transactions).where(eq(transactions.id, id)).returning();
        return deleted;
    });
};
