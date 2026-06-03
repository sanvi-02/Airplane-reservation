import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

export const hasDatabase = Boolean(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null };

export const prisma =
  globalForPrisma.prisma ||
  (hasDatabase
    ? new PrismaClient({
        adapter: new PrismaPg(
          new pg.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
          })
        ),
      })
    : null);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
