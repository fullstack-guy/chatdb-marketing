import { router, procedure } from "../trpc";

const isSubscribed = async (supabase, userId) => {
  const { data: subscriptions, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    throw error;
  }
  return subscriptions;

  if (!subscriptions.length || !subscriptions[0].is_active) {
    return false;
  }

  return true;
};
export const subscriptionsRouter = router({
  getSubscription: procedure.query((opts) => {
    const { ctx } = opts;
    console.log("user id", ctx.user.userId);
    const subscribed = isSubscribed(ctx.systemSupabase, ctx.user.userId);

    return subscribed;
  }),
});
