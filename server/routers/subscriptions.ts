import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

const createSupabasePaddleSubscription = async (
  supabase,
  userId,
  customerId,
  plan
) => {
  const { data, error } = await supabase.from("paddle_subscriptions").upsert({
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

const updateSupabasePaddleSubscription = async (supabase, userId, plan) => {
  try {
    const { data, error } = await supabase
      .from("paddle_subscriptions")
      .update({
        plan,
      })
      .eq("user_id", userId);

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
    return {
      error: e,
    };
  }
};

const cancelPaddleSubscription = async (id) => {
  try {
    const response = await fetch(
      `${process.env.PADDLE_API_URL}/subscriptions/${id}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
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

const getPaddleSubscriptionIdFromUserId = async (supabase, userId) => {
  console.log("usususus", userId);
  const { data, error } = await supabase
    .from("paddle_subscriptions")
    .select("paddle_subscription_id, address_id, customer_id, plan")
    .eq("user_id", userId)
    .single();

  if (error) {
    return {
      sub: null,
      error,
    };
  } else {
    return {
      sub: data,
      error: null,
    };
  }
};

const updatePaddleSubscription = async (subId, ctmId, addId, price_id) => {
  try {
    const response = await fetch(
      `${process.env.PADDLE_API_URL}/subscriptions/${subId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
        },
        body: JSON.stringify({
          customer_id: ctmId,
          collection_mode: "automatic",
          proration_billing_mode: "prorated_immediately",
          address_id: addId,
          items: [
            {
              price_id,
              quantity: 1,
            },
          ],
        }),
      }
    );

    return { data: await response.json(), error: null };
  } catch (e) {
    console.log(e);
    return {
      data: null,
      error: "Unable to update subscription",
    };
  }
};

const getSubscriptionFromPaddleAPI = async (subId) => {
  try {
    const response = await fetch(
      `${process.env.PADDLE_API_URL}/subscriptions/${subId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
        },
      }
    );
    return { data: await response.json(), error: null };
  } catch (e) {
    return {
      data: null,
      error: "Unable to get subscription from Paddle",
    };
  }
};

const getUserDatabases = async (supabase, userId) => {
  const { data, error } = await supabase
    .from("user_databases")
    .select("*")
    .eq("user_id", userId);

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

const getPaddlePriceId = (priceName) => {
  const plans = {
    ["chatDB Hobby Plan"]: {
      monthlyPriceId: "pri_01h90zjbsana88btxhepx13g9n",
    },
    ["chatDB Pro Plan"]: {
      monthlyPriceId: "pri_01h90zt3jwcrxsjsmfyzb8qqda",
    },
  };

  return plans[priceName].monthlyPriceId;
};

const getUserRemainingDatabases = (subscription, dbs, plan) => {
  if (
    subscription.data.data.status !== "active" ||
    subscription.data.data.scheduled_change?.action === "cancel"
  ) {
    console.log("Subscription is not active");
    return null;
  } else if (plan === "chatDB Hobby Plan") {
    return 1 - dbs.length;
  } else if (plan === "chatDB Pro Plan") {
    return 5 - dbs.length;
  }
};

const getAllowedNumberOfDatabases = (plan) => {
  if (plan === "chatDB Hobby Plan") {
    return 1;
  } else if (plan === "chatDB Pro Plan") {
    return 5;
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
      const { error: subscriptionError } =
        await createSupabasePaddleSubscription(
          ctx.systemSupabase,
          ctx.user.userId,
          input.customerId,
          input.items[0].product.name
        );

      if (subscriptionError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to create subscription, please try again later.",
          cause: subscriptionError,
        });
      }

      ctx.users
        .updateUserMetadata(ctx.user.userId, {
          publicMetadata: {
            plan: input.items[0].product.name,
            isActive: true,
          },
          privateMetadata: {
            ctmId: input.customerId,
          },
        })
        .catch((e) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not update the user meta data.",
            cause: e,
          });
        });
      return {
        message: "Subscription created successfully",
      };
    }),
  cancel: protectedProcedure.mutation(async (opts) => {
    const { ctx } = opts;
    const { sub, error: subError } = await getPaddleSubscriptionIdFromUserId(
      ctx.systemSupabase,
      ctx.user.userId
    );
    if (subError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to get subscription",
        cause: subError,
      });
    }

    const { error } = await cancelPaddleSubscription(
      sub.paddle_subscription_id
    );

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to cancel subscription",
        cause: error,
      });
    }

    ctx.users
      .updateUserMetadata(ctx.user.userId, {
        publicMetadata: {
          plan: null,
          isActive: false,
        },
      })
      .catch((e) => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to update user metadata",
          cause: e,
        });
      });

    return { message: "Subscription canceled successfully" };
  }),
  update: protectedProcedure
    .input(
      z.object({
        plan: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const { sub, error: subError } = await getPaddleSubscriptionIdFromUserId(
        ctx.systemSupabase,
        ctx.user.userId
      );
      if (subError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to get subscription",
          cause: subError,
        });
      }

      const { data, error } = await updatePaddleSubscription(
        sub.paddle_subscription_id,
        sub.customer_id,
        sub.address_id,
        getPaddlePriceId(input.plan)
      );

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to update subscription",
          cause: error,
        });
      }

      const { error: updateError } = await updateSupabasePaddleSubscription(
        ctx.systemSupabase,
        ctx.user.userId,
        input.plan
      );

      if (updateError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to update subscription",
          cause: updateError,
        });
      }

      ctx.users
        .updateUserMetadata(ctx.user.userId, {
          publicMetadata: {
            plan: input.plan,
          },
        })
        .catch((e) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unable to update user metadata",
            cause: e,
          });
        });

      return { message: "Successfully updated subscription!" };
    }),

  status: protectedProcedure.query(async (opts) => {
    const { ctx } = opts;
    const { data, error } = await getUserDatabases(
      ctx.userSupabase,
      ctx.user.userId
    );

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to get user databases",
        cause: error,
      });
    }

    const { sub, error: subError } = await getPaddleSubscriptionIdFromUserId(
      ctx.systemSupabase,
      ctx.user.userId
    );

    if (subError) {
      return {
        remainingDatabases: null,
        user: ctx.user,
        allowedNumberOfDatabases: null,
      };
    }

    const subscriptionFromPaddleAPI = await getSubscriptionFromPaddleAPI(
      sub.paddle_subscription_id
    );
    console.log(subscriptionFromPaddleAPI);
    return {
      remainingDatabases: getUserRemainingDatabases(
        subscriptionFromPaddleAPI,
        data,
        sub.plan
      ),
      allowedNumberOfDatabases: getAllowedNumberOfDatabases(sub.plan),
      user: ctx.user,
    };
  }),
});
