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
    }

    initSupabase();

    // Refresh token every 55 seconds
    const intervalId = setInterval(() => {
      initSupabase();
    }, 55000); // 55 * 1000 ms

    // Clear interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [getToken]);

  return client;
};

export default useSupabase;
