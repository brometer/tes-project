import { db } from '../db';
import { categories, categoryTypeEnum } from '../db/schema';
import { eq, and, or, isNull } from 'drizzle-orm';

export const findAll = async (userId: string) => {
    // Return both user-specific categories OR system defaults (where userId is null)
    return await db.select().from(categories).where(
        or(eq(categories.userId, userId), isNull(categories.userId))
    );
};

export const create = async (userId: string, data: { name: string, icon: string, type: 'income' | 'expense' | 'both' }) => {
    const [result] = await db.insert(categories).values({
        userId,
        name: data.name,
        icon: data.icon,
        type: data.type
    }).returning();
    return result;
};

export const remove = async (id: string, userId: string) => {
    // Only allow deleting user-owned categories
    const [deleted] = await db.delete(categories).where(
        and(eq(categories.id, id), eq(categories.userId, userId))
    ).returning();
    return deleted;
};
