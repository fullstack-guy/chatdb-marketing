import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

const deleteUserDatabase = async (supabase, uuid) => {
  const { data, error } = await supabase
    .from("user_databases")
    .delete()
    .eq("uuid", uuid);

  if (error) {
    return {
      data: null,
      error,
    };
  } else {
    return {
      data,
      error: null,
    };
  }
};

const deleteUserSchema = async (supabase, uuid) => {
  const { data, error } = await supabase
    .from("user_schemas")
    .delete()
    .eq("uuid", uuid);

  if (error) {
    return {
      data: null,
      error,
    };
  } else {
    return {
      data,
      error: null,
    };
  }
};
export const databasesRouter = router({
  delele: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const { error: databaseError } = await deleteUserDatabase(
        ctx.userSupabase,
        input.uuid
      );

      if (databaseError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to delete database",
          cause: databaseError,
        });
      }

      const { error: schemaError } = await deleteUserSchema(
        ctx.userSupabase,
        input.uuid
      );

      if (schemaError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to delete schema",
          cause: schemaError,
        });
      }

      return { message: "Database deleted successfully" };
    }),
});
