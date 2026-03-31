import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Palette } from "lucide-react";
import { motion } from "framer-motion";
import PromptForm from "@/components/PromptForm";
import FigmaConnect from "@/components/FigmaConnect";
import ApiKeySettings, { getStoredApiKey } from "@/components/ApiKeySettings";
import { useToast } from "@/hooks/use-toast";
import { getFigmaConnection } from "@/lib/figma";

const AGENT_URL = "https://designfolio-agent-production.up.railway.app";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [figmaConnected, setFigmaConnected] = useState(false);
  const [mcpPrompt, setMcpPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handlePromptSubmit = async (prompt: string) => {
    setLastPrompt(prompt);
    setMcpPrompt(null);
    setIsGenerating(true);

    const figmaConnection = getFigmaConnection();

    if (!figmaConnection?.access_token) {
      toast({
        title: "Figma not connected",
        description: "Connect your Figma account to generate designs.",
        variant: "destructive",
      });
      setIsGenerating(false);
      return;
    }

    toast({
      title: "Generating your design...",
      description: "Creating your landing page directly in Figma. This may take a few minutes.",
    });

    try {
      const userApiKey = getStoredApiKey();
      const response = await fetch(`${AGENT_URL}/generate-mcp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          figma_access_token: figmaConnection.access_token,
          ...(userApiKey && { api_key: userApiKey }),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        toast({
          title: "Generation failed",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } else {
        setMcpPrompt(prompt);
        toast({
          title: "Design created!",
          description: "Your landing page has been created directly in Figma.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Generation failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const displayName = profile?.display_name || user?.user_metadata?.full_name || "Designer";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <span className="text-sm font-black text-primary-foreground">D</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Designfolio</span>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="flex gap-8">

          {/* Left sidebar — Integrations */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-80 shrink-0"
          >
            <div className="sticky top-24 space-y-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-4">
                Connections
              </h2>

              {/* Anthropic */}
              <ApiKeySettings />

              {/* Figma */}
              <FigmaConnect onConnectionChange={setFigmaConnected} />

              {/* Canvas — Coming Soon */}
              <Card className="border-border/50 bg-card opacity-60">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                        <Palette className="h-3.5 w-3.5 text-orange-500" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">Canvas</p>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                      Soon
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.aside>

          {/* Right content — Prompt & Results */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Welcome back, {displayName.split(" ")[0]} 👋
              </h1>
              <p className="mt-1 text-base text-muted-foreground">
                Describe your landing page and generate it directly in Figma.
              </p>
            </motion.div>

            <div className="mt-8">
              <PromptForm onSubmit={handlePromptSubmit} isGenerating={isGenerating} disabled={!figmaConnected} />
            </div>

            {mcpPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6"
              >
                <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wide">
                  Design created in Figma
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your landing page has been created directly in your Figma account. Open Figma to see it.
                </p>
              </motion.div>
            )}

            {lastPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-border/50 bg-card p-6"
              >
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Last prompt
                </h3>
                <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{lastPrompt}</p>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
