import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./contex";

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next();
});
export const protectedProcedure = t.procedure.use(isAuthed);

export const router = t.router;
export const procedure = t.procedure;
