import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

export const hasDatabase = Boolean(process.env.DATABASE_URL);

neonConfig.webSocketConstructor = ws;

export const prisma = hasDatabase
  ? new PrismaClient({
      adapter: new PrismaNeon({
        connectionString: process.env.DATABASE_URL!,
      }),
    })
  : null;
