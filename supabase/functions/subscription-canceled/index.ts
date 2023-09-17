// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  const payload = await req.json();

  if (payload.event_type === "subscription.canceled") {
    console.log("subscription.activated", payload);

    try {
      const supabaseClient = createClient(
        Deno.env.get("CLIENT_SUPABASE_URL") ?? "",
        Deno.env.get("CLIENT_SUPABASE_ANON_KEY") ?? ""
      );

      const { error } = await supabaseClient
        .from("paddle_subscriptions")
        .delete()
        .eq("paddle_subscription_id", payload.data.id);

      if (error) {
        throw new Error("Error canceling subscription");
      }

      return new Response(
        JSON.stringify({
          message: "Canceled subscription Webhook processed successfully!",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
