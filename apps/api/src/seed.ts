import 'dotenv/config';
import { db } from './db/index.js';
import { categories } from './db/schema.js';

const defaultCategories = [
    { name: 'Makanan & Minuman', icon: 'restaurant', type: 'expense' as const },
    { name: 'Transportasi', icon: 'commute', type: 'expense' as const },
    { name: 'Belanja', icon: 'shopping_cart', type: 'expense' as const },
    { name: 'Hiburan', icon: 'movie', type: 'expense' as const },
    { name: 'Kesehatan', icon: 'health_and_safety', type: 'expense' as const },
    { name: 'Pendidikan', icon: 'school', type: 'expense' as const },
    { name: 'Kebutuhan Rumah', icon: 'home', type: 'expense' as const },
    { name: 'Tagihan & Utilitas', icon: 'receipt_long', type: 'expense' as const },
    { name: 'Pakaian', icon: 'checkroom', type: 'expense' as const },
    { name: 'Donasi & Zakat', icon: 'volunteer_activism', type: 'expense' as const },
    { name: 'Gaji', icon: 'payments', type: 'income' as const },
    { name: 'Freelance', icon: 'work', type: 'income' as const },
    { name: 'Investasi', icon: 'trending_up', type: 'income' as const },
    { name: 'Hadiah', icon: 'redeem', type: 'income' as const },
    { name: 'Lainnya', icon: 'more_horiz', type: 'both' as const },
];

async function seed() {
    console.log('🌱 Seeding default categories...');
    
    for (const cat of defaultCategories) {
        await db.insert(categories).values({
            userId: null as any, // System default (no user owner)
            name: cat.name,
            icon: cat.icon,
            type: cat.type,
        }).onConflictDoNothing();
    }
    
    console.log(`✅ Seeded ${defaultCategories.length} default categories.`);
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
