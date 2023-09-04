import { router, procedure, protectedProcedure } from "../trpc";
import { z } from "zod";

const createSubscription = async (supabase, userId, customerId, plan) => {
  const { data, error } = await supabase.from("paddle_subscriptions").insert({
    user_id: userId,
    customer_id: customerId,
    plan,
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

const cancelPaddleSubscription = async (id) => {
  try {
    const response = await fetch(
      `${process.env.PADDLE_SANDBOX_API_URL}/subscriptions/${id}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PADDLE_SANDBOX_API_KEY}`,
        },
        body: JSON.stringify({
          effective_from: "next_billing_period",
        }),
      }
    );

    return { data: null, error: null };
  } catch (e) {
    console.log(e);
    return {
      data: null,
      error: e.message,
    };
  }
};

const getUserSubscription = async (supabase, userId) => {
  const { data, error } = await supabase
    .from("paddle_subscriptions")
    .select("paddle_subscription_id")
    .eq("user_id", userId)
    .single();

  if (error) {
    return {
      id: null,
      error,
    };
  } else {
    return {
      id: data.paddle_subscription_id,
      error: null,
    };
  }
};

export const subscriptionsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        customerId: z.string(),
        items: z.array(z.object({ product: z.object({ name: z.string() }) })),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      try {
        await ctx.users.updateUserMetadata(ctx.user.userId, {
          publicMetadata: {
            customerId: input.customerId,
          },
        });

        const { error: subscriptionError } = await createSubscription(
          ctx.systemSupabase,
          ctx.user.userId,
          input.customerId,
          input.items[0].product.name
        );

        if (subscriptionError) {
          return {
            subscriptionError,
          };
        }

        ctx.users
          .updateUserMetadata(ctx.user.userId, {
            publicMetadata: {
              plan: input.items[0].product.name,
              isActive: true,
            },
          })
          .catch((e) => {
            throw new Error("Unable to update user metadata");
          });
      } catch (e) {
        console.log(e);
        return e.message;
      }
    }),
  cancel: protectedProcedure.mutation(async (opts) => {
    try {
      const { ctx } = opts;
      const { id, error: subError } = await getUserSubscription(
        ctx.systemSupabase,
        ctx.user.userId
      );
      if (subError) {
        throw new Error("Unable to get subscription");
      }
      const { error } = await cancelPaddleSubscription(id);

      if (error) {
        throw new Error("Unable to cancel subscription");
      }

      ctx.users
        .updateUserMetadata(ctx.user.userId, {
          publicMetadata: {
            isActive: false,
            plan: null,
          },
        })
        .catch((e) => {
          throw new Error("Unable to update user metadata");
        });

      return { message: "Subscription canceled successfully" };
    } catch (err) {
      console.error(err);
      return {
        error: err.message,
      };
    }
  }),
});
