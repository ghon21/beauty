import { Pool } from "pg";

export const hasDb = Boolean(process.env.DATABASE_URL);

const globalForPg = globalThis as unknown as { __lumierePool?: Pool };

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!globalForPg.__lumierePool) {
    globalForPg.__lumierePool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
    });
  }
  return globalForPg.__lumierePool;
}
