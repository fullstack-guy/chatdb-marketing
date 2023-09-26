import { z } from "zod";
import { procedure, router } from "../trpc";
import { subscriptionsRouter } from "./subscriptions";
import { databasesRouter } from "./db";

export const appRouter = router({
  subscriptions: subscriptionsRouter,
  databases: databasesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
