import { createTRPCRouter } from "~/server/api/trpc";
import { gridRouter } from "./routers/grid";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  grid: gridRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
