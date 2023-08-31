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

const updateSubcription = async (supabase, customerId, userId, plan) => {
  const { data, error } = await supabase
    .from("paddle_subscriptions")
    .upsert({
      is_active: "active",
      customer_id: customerId,
      user_id: userId,
      plan,
    })
    .eq("customer_id", customerId)
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
        purchasedItems: z.array(
          z.object({ product: z.object({ name: z.string() }) })
        ),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      console.log("input", input, ctx.user.userId);
      try {
        await ctx.users.updateUserMetadata(ctx.user.userId, {
          publicMetadata: {
            customerId: input.customerId,
            activePlan: input.purchasedItems[0].product.name,
          },
        });
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
