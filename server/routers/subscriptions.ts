import { router, procedure } from "../trpc";
import { z } from "zod";
export const postRouter = router({
  getSubscription: procedure
    query((opts) => {
      const { ctx } = opts;

      return ctx
    }),
  
});
