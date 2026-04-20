import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { LogOut, Palette, Menu, PenLine, Eye } from "lucide-react";
import { motion } from "framer-motion";
import PromptForm from "@/components/PromptForm";
import FigmaConnect from "@/components/FigmaConnect";
import ApiKeySettings from "@/components/ApiKeySettings";
import FigmaFiles from "@/components/FigmaFiles";
import { useToast } from "@/hooks/use-toast";
import { getFigmaConnection } from "@/lib/figma";

const FIGMA_MAKE_URL = "https://www.figma.com/make";

/* ── Dashboard ─────────────────────────────────────────────── */

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [figmaConnected, setFigmaConnected] = useState(() => !!getFigmaConnection());
  const [mcpPrompt, setMcpPrompt] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "view">("create");
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

  const handlePromptSubmit = (prompt: string) => {
    setLastPrompt(prompt);
    setMcpPrompt(null);

    // Deep-link into Figma Make with the prompt pre-filled.
    // User must be logged into figma.com — the Figma OAuth we already did
    // ensures their session cookie is present in most cases.
    const url = `${FIGMA_MAKE_URL}?prompt=${encodeURIComponent(prompt)}`;
    const newTab = window.open(url, "_blank", "noopener,noreferrer");

    if (!newTab) {
      toast({
        title: "Popup blocked",
        description: "Allow popups for this site, then try again.",
        variant: "destructive",
      });
      return;
    }

    setMcpPrompt(prompt);
    toast({
      title: "Opened in Figma Make",
      description: "Your prompt is pre-filled in the new tab. Continue the design there.",
    });
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(true)}
              className="relative"
            >
              <Menu className="h-5 w-5" />
              {!figmaConnected && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500" />
              )}
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <span className="text-sm font-black text-primary-foreground">D</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">Designfolio</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Free Tier
            </span>
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

      {/* Burger menu — Connections drawer */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-80 sm:w-96 overflow-y-auto">
          <SheetHeader className="text-left pb-6">
            <SheetTitle className="text-lg font-bold">Connections</SheetTitle>
            <SheetDescription>
              Manage your service integrations
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-3">
            {/* Anthropic API Key */}
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
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-muted p-1 mb-8">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "create"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PenLine className="h-4 w-4" />
            Create
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "view"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-4 w-4" />
            View
          </button>
        </div>

        {activeTab === "create" ? (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                What are we designing today?
              </h1>
              <p className="mt-1 text-base text-muted-foreground">
                Describe your idea and let AI bring it to life in your design tool.
              </p>
            </div>

            {/* Prompt Form */}
            <PromptForm onSubmit={handlePromptSubmit} disabled={!figmaConnected} />

            {/* Results */}
            {mcpPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6"
              >
                <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wide">
                  Opened in Figma Make
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Continue designing in the Figma Make tab. If the popup was blocked,{" "}
                  <a
                    href={`${FIGMA_MAKE_URL}?prompt=${encodeURIComponent(mcpPrompt)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-emerald-600 hover:text-emerald-700"
                  >
                    click here to open it manually
                  </a>
                  .
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
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Your Figma files
              </h1>
              <p className="mt-1 text-base text-muted-foreground">
                Browse your recent designs. Click to open in Figma.
              </p>
            </div>

            <FigmaFiles connected={figmaConnected} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
