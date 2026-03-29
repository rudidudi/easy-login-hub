import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { saveFigmaConnection } from "@/lib/figma";

const FigmaCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const exchangeCode = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const savedState = sessionStorage.getItem("figma_oauth_state");

      if (!code) {
        setError("No authorization code received from Figma.");
        return;
      }

      if (state !== savedState) {
        setError("Invalid OAuth state. Please try connecting again.");
        return;
      }

      sessionStorage.removeItem("figma_oauth_state");

      try {
        const { data, error: fnError } = await supabase.functions.invoke("figma-oauth", {
          body: {
            code,
            redirect_uri: import.meta.env.VITE_FIGMA_REDIRECT_URI,
          },
        });

        if (fnError || data?.error) {
          setError(data?.error || fnError?.message || "Failed to connect Figma.");
          return;
        }

        saveFigmaConnection({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: Date.now() + data.expires_in * 1000,
          user_id: data.user_id,
          handle: data.handle,
          email: data.email,
        });

        navigate("/dashboard");
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      }
    };

    exchangeCode();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-md rounded-2xl border border-destructive/30 bg-card p-8 text-center">
          <h2 className="text-lg font-bold text-foreground">Connection Failed</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Connecting your Figma account...</p>
      </div>
    </div>
  );
};

export default FigmaCallback;
