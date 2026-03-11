import { db } from '../db';
import { bankAccounts } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const findByUserId = async (userId: string) => {
    return await db.select().from(bankAccounts).where(
        and(eq(bankAccounts.userId, userId), eq(bankAccounts.isDeleted, false))
    );
};

export const findById = async (id: string, userId: string) => {
    const result = await db.select().from(bankAccounts).where(
        and(eq(bankAccounts.id, id), eq(bankAccounts.userId, userId), eq(bankAccounts.isDeleted, false))
    );
    return result[0];
};

export const create = async (userId: string, data: { name: string, balance: number, color: string }) => {
    const result = await db.insert(bankAccounts).values({
        userId,
        name: data.name,
        balance: data.balance,
        color: data.color,
    }).returning();
    return result[0];
};

export const update = async (id: string, userId: string, data: { name?: string, color?: string, balance?: number }) => {
    const result = await db.update(bankAccounts).set({
        ...data,
        updatedAt: new Date(),
    }).where(
        and(eq(bankAccounts.id, id), eq(bankAccounts.userId, userId))
    ).returning();
    return result[0];
};

export const softDelete = async (id: string, userId: string) => {
    const result = await db.update(bankAccounts).set({
        isDeleted: true,
        updatedAt: new Date(),
    }).where(
        and(eq(bankAccounts.id, id), eq(bankAccounts.userId, userId))
    ).returning();
    return result[0];
};
