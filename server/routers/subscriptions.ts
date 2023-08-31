import { router, procedure, protectedProcedure } from "../trpc";
import { z } from "zod";

const createSubscription = async (supabase, userId, customerId, plan) => {
  const { data, error } = await supabase
    .from("paddle_subscriptions")
    .insert({
      user_id: userId,
      customer_id: customerId,
      plan,
      is_active: true,
    });

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
  create: protectedProcedure
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
      try {
        await ctx.users.updateUserMetadata(ctx.user.userId, {
          publicMetadata: {
            customerId: input.customerId,
            activePlan: input.purchasedItems[0].product.name,
          },
        });

        const { error: subscriptionError } = await createSubscription(
          ctx.systemSupabase,
          ctx.user.userId,
          input.customerId,
          input.purchasedItems[0].product.name
        );

        if (subscriptionError) {
          return {
            subscriptionError,
          };
        }
      } catch (e) {
        console.log(e);
        return e;
      }
    }),
  cancel: protectedProcedure.input(z.object({})).mutation(async (opts) => {}),
});
