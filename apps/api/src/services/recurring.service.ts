import { db } from '../db';
import { recurringTransactions } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const findAll = async (userId: string) => {
    return await db.select().from(recurringTransactions).where(eq(recurringTransactions.userId, userId));
};

export const create = async (userId: string, data: any) => {
    const [result] = await db.insert(recurringTransactions).values({
        userId,
        ...data,
    }).returning();
    return result;
};

export const update = async (id: string, userId: string, data: any) => {
    const [result] = await db.update(recurringTransactions).set({
        ...data,
        updatedAt: new Date(),
    }).where(
        and(eq(recurringTransactions.id, id), eq(recurringTransactions.userId, userId))
    ).returning();
    return result;
};

export const toggleActive = async (id: string, userId: string) => {
    const [current] = await db.select({ isActive: recurringTransactions.isActive }).from(recurringTransactions)
        .where(and(eq(recurringTransactions.id, id), eq(recurringTransactions.userId, userId)));
    
    if (!current) throw new Error("Recurring transaction not found");

    const [result] = await db.update(recurringTransactions).set({
        isActive: !current.isActive,
        updatedAt: new Date()
    }).where(
        and(eq(recurringTransactions.id, id), eq(recurringTransactions.userId, userId))
    ).returning();
    return result;
};

export const remove = async (id: string, userId: string) => {
    const [deleted] = await db.delete(recurringTransactions).where(
        and(eq(recurringTransactions.id, id), eq(recurringTransactions.userId, userId))
    ).returning();
    return deleted;
};
