import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { supabaseClient } from "../utils/supabaseClient";

const useSupabase = () => {
  const [client, setClient] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    async function initSupabase() {
      const token = await getToken({ template: "supabase" });
      const supabase = supabaseClient(
        token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      setClient(supabase);
      console.log("tokenene", token);
    }
    initSupabase();
  }, [getToken]);

  return client;
};

export default useSupabase;
