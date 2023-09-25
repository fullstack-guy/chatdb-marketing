import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
    const payload = await req.json();
    if (payload.type === "user.created" || payload.type === "user.updated") {
      const user = payload.data;
      const userData = {
        id: user.id,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        full_name:
          user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : null,
        image_url: user.image_url || null,
        last_sign_in_at: user.last_sign_in_at
          ? new Date(user.last_sign_in_at)
          : null,
        created_at: new Date(user.created_at),
        updated_at: new Date(user.updated_at),
        email_address:
          user.email_addresses.length > 0
            ? user.email_addresses[0].email_address
            : null,
      };
      const { error } = await supabaseClient.from("users").upsert(userData, {
        conflictFields: ["id"],
      });
      console.error("Error: " + JSON.stringify(error));
      if (error) throw error;
    } else if (payload.type === "user.deleted") {
      const { data, error } = await supabaseClient
        .from("users")
        .update({
          request_deleted: true,
        })
        .eq("id", payload.data.id)
        .select();
      if (error) throw error;
    }
    return new Response(
      JSON.stringify({
        message: "Webhook processed successfully!",
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
        error: JSON.stringify(error),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});
