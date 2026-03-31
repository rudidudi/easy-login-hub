import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LogOut, Palette, ChevronDown, Settings2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PromptForm from "@/components/PromptForm";
import FigmaConnect from "@/components/FigmaConnect";
import ApiKeySettings, { getStoredApiKey } from "@/components/ApiKeySettings";
import { useToast } from "@/hooks/use-toast";
import { getFigmaConnection } from "@/lib/figma";

const AGENT_URL = "https://designfolio-agent-production.up.railway.app";

/* ── Collapsible Connections Panel ─────────────────────────── */

const ConnectionsPanel = ({
  figmaConnected,
  onFigmaConnectionChange,
}: {
  figmaConnected: boolean;
  onFigmaConnectionChange: (v: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);
  const apiKey = getStoredApiKey();
  const connectedCount = [figmaConnected, !!apiKey].filter(Boolean).length;
  const totalCount = 2; // Figma + API key (Canvas is coming soon)
  const allConnected = connectedCount === totalCount;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-card px-5 py-3.5 transition-colors hover:bg-accent/50 group">
          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${allConnected ? "bg-emerald-500/10" : "bg-orange-500/10"}`}>
              {allConnected ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <Settings2 className="h-4 w-4 text-orange-500" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Connections</p>
              <p className="text-xs text-muted-foreground">
                {allConnected
                  ? "All services connected"
                  : `${connectedCount} of ${totalCount} connected`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!allConnected && (
              <span className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-orange-500 uppercase tracking-wide">
                <AlertCircle className="h-3 w-3" />
                Setup needed
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="mt-2 space-y-2">
          {/* Anthropic API Key */}
          <ApiKeySettings />

          {/* Figma */}
          <FigmaConnect onConnectionChange={onFigmaConnectionChange} />

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
      </CollapsibleContent>
    </Collapsible>
  );
};

/* ── Dashboard ─────────────────────────────────────────────── */

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

      {/* Main content */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Welcome back, {displayName.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            Describe your idea and let AI bring it to life in your design tool.
          </p>
        </motion.div>

        {/* Collapsible Connections */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <ConnectionsPanel
            figmaConnected={figmaConnected}
            onFigmaConnectionChange={setFigmaConnected}
          />
        </motion.div>

        {/* Prompt Form */}
        <PromptForm onSubmit={handlePromptSubmit} isGenerating={isGenerating} disabled={!figmaConnected} />

        {/* Results */}
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
      </div>
    </div>
  );
};

export default Dashboard;
