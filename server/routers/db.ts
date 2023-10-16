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
  getAll: protectedProcedure.query(async (opts) => {
    const { ctx } = opts;
    const { data: schemas, error } = await ctx.userSupabase
      .from("user_schemas")
      .select("uuid, title");

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to fetch databases",
        cause: error,
      });
    }

    const { data: databaseTypes, error: databaseTypesError } =
      await ctx.userSupabase.from("user_databases").select("uuid, db_type");

    if (databaseTypesError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to fetch database types",
        cause: databaseTypesError,
      });
    }

    const databaseTypesMap = databaseTypes.reduce(
      (acc, { uuid, db_type }) => ({
        ...acc,
        [uuid]: db_type,
      }),
      {}
    );

    return schemas.map(({ uuid, title }) => ({
      uuid,
      title,
      dbType: databaseTypesMap[uuid],
    }));
  }),

  delete: protectedProcedure
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
  getDbType: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .query(async (opts) => {
      const { ctx, input } = opts;
      const { data, error } = await ctx.userSupabase
        .from("user_databases")
        .select("db_type")
        .eq("uuid", input.uuid);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to fetch database type",
          cause: error,
        });
      }

      return data[0].db_type.toLowerCase();
    }),
});
