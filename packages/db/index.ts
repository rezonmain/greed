import { PrismaClient, Prisma } from "@prisma/client";
import cuid2 from "./middleware/cuid2";

import { env } from "@greed/env";

const createPrismaClient = (): PrismaClient => {
  const prisma = new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
  prisma.$use(cuid2);
  return prisma;
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "./prisma/zod";
export { Prisma };
