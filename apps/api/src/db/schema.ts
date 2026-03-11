import { pgTable, text, timestamp, boolean, varchar, bigint, uuid, integer, pgEnum } from "drizzle-orm/pg-core";

// Better Auth Tables (System)
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull()
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId").notNull().references(() => user.id),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt")
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId").notNull().references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	expiresAt: timestamp("expiresAt"),
	password: text("password"),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt")
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt")
});

// App Enums
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const categoryTypeEnum = pgEnum('category_type', ['income', 'expense', 'both']);
export const intervalEnum = pgEnum('recurring_interval', ['weekly', 'monthly', 'yearly']);

// App Tables
export const bankAccounts = pgTable("bank_accounts", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().references(() => user.id),
	name: varchar("name", { length: 100 }).notNull(),
	balance: bigint("balance", { mode: "number" }).notNull().default(0),
	color: varchar("color", { length: 20 }).notNull().default('blue'),
	isDeleted: boolean("is_deleted").default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const categories = pgTable("categories", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").references(() => user.id), // Null for system defaults
	name: varchar("name", { length: 100 }).notNull(),
	icon: varchar("icon", { length: 50 }).notNull(),
	type: categoryTypeEnum("type").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
});

export const transactions = pgTable("transactions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().references(() => user.id),
	bankAccountId: uuid("bank_account_id").notNull().references(() => bankAccounts.id),
	categoryId: uuid("category_id").notNull().references(() => categories.id),
	type: transactionTypeEnum("type").notNull(),
	amount: bigint("amount", { mode: "number" }).notNull(), 
	description: text("description").notNull(),
	date: timestamp("date", { mode: "date" }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const budgets = pgTable("budgets", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().references(() => user.id),
	categoryId: uuid("category_id").notNull().references(() => categories.id),
	limitAmount: bigint("limit_amount", { mode: "number" }).notNull(),
	month: integer("month").notNull(), // 1-12
	year: integer("year").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const recurringTransactions = pgTable("recurring_transactions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().references(() => user.id),
	bankAccountId: uuid("bank_account_id").notNull().references(() => bankAccounts.id),
	categoryId: uuid("category_id").notNull().references(() => categories.id),
	name: varchar("name", { length: 200 }).notNull(),
	amount: bigint("amount", { mode: "number" }).notNull(),
	type: transactionTypeEnum("type").notNull(),
	interval: intervalEnum("recurring_interval").notNull(),
	dayOfInterval: integer("day_of_interval").notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const recurringLogs = pgTable("recurring_logs", {
	id: uuid("id").primaryKey().defaultRandom(),
	recurringId: uuid("recurring_id").notNull().references(() => recurringTransactions.id),
	transactionId: uuid("transaction_id").references(() => transactions.id),
	executedAt: timestamp("executed_at").defaultNow().notNull(),
	periodMonth: integer("period_month").notNull(),
	periodYear: integer("period_year").notNull()
});
