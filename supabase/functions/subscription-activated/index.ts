// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
serve(async (req) => {
  const payload = await req.json();
  if (payload.event_type === "subscription.activated") {
    console.log("subscription.activated", payload);
    try {
      const supabaseClient = createClient(
        Deno.env.get("CLIENT_SUPABASE_URL") ?? "",
        Deno.env.get("CLIENT_SUPABASE_ANON_KEY") ?? ""
      );
      const { error } = await supabaseClient
        .from("paddle_subscriptions")
        .update({
          billing_cycle: payload.data.billing_cycle,
          paddle_subscription_id: payload.data.id,
          next_billed_at: payload.data.items[0].next_billed_at,
          address_id: payload.data.address_id,
          is_active: true,
        })
        .eq("customer_id", payload.data.customer_id);
      if (error) {
        throw new Error("Error creating subscription");
      }
      return new Response(
        JSON.stringify({
          message: "Activated subscription Webhook processed successfully!",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        }
      );
    }
  }
});
