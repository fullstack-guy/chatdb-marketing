import { router, procedure, protectedProcedure } from "../trpc";
import { z } from "zod";

const updateUser = async (supabase, userId, customerId) => {
  const { data, error } = await supabase
    .from("users")
    .update({ paddle_customer_id: customerId })
    .eq("id", userId)
    .single();

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

export const subscriptionsRouter = router({
  createCustomer: protectedProcedure
    .input(
      z.object({
        customerId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;

      try {
        const updatedMetaData = await ctx.users.updateUserMetadata(
          ctx.user.userId,
          {
            privateMetadata: {
              customerId: input.customerId,
            },
          }
        );
        const { data, error } = await updateUser(
          ctx.systemSupabase,
          ctx.user.userId,
          input.customerId
        );

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
      } catch (e) {
        console.log(e);
        return e;
      }
    }),
});
