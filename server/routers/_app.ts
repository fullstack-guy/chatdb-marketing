import { z } from "zod";
import { procedure, router } from "../trpc";
import { subscriptionsRouter } from "./subscriptions";

export const appRouter = router({
  subscriptions: subscriptionsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
