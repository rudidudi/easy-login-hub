import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import PromptForm from "@/components/PromptForm";
import FigmaConnect from "@/components/FigmaConnect";
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

  const [figmaFileUrl, setFigmaFileUrl] = useState<string | null>(null);

  const handlePromptSubmit = async (prompt: string) => {
    setLastPrompt(prompt);
    setFigmaFileUrl(null);
    setIsGenerating(true);
    toast({
      title: "Generating your landing page...",
      description: "Claude is designing your page in Figma. This may take a couple of minutes.",
    });

    try {
      const connection = getFigmaConnection();
      const response = await fetch(`${AGENT_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          plan_key: connection?.plan_key || "",
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        toast({
          title: "Generation failed",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data.figma_file_url) {
        setFigmaFileUrl(data.figma_file_url);
      }

      toast({
        title: "Landing page created!",
        description: "Your design has been created in Figma.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate. Please try again.",
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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
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

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Welcome back, {displayName.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Describe your landing page and generate it directly in Figma.
          </p>
        </motion.div>

        <div className="mt-8">
          <FigmaConnect onConnectionChange={setFigmaConnected} />
        </div>

        <div className="mt-6">
          <PromptForm onSubmit={handlePromptSubmit} isGenerating={isGenerating} disabled={!figmaConnected} />
        </div>

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
            {figmaFileUrl && (
              <a
                href={figmaFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#A259FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#8B3FE0] transition-colors"
              >
                Open in Figma
              </a>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
