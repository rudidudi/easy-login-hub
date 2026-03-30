import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Figma, Loader2, Puzzle, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type GenerationMode = "plugin" | "mcp";

interface PromptFormProps {
  onSubmit: (prompt: string, mode: GenerationMode) => void;
  isGenerating?: boolean;
  activeMode?: GenerationMode | null;
  disabled?: boolean;
}

const PromptForm = ({ onSubmit, isGenerating = false, activeMode = null, disabled = false }: PromptFormProps) => {
  const [prompt, setPrompt] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = (mode: GenerationMode) => {
    if (!prompt.trim() || isGenerating) return;
    onSubmit(prompt.trim(), mode);
  };

  // Simulate progress while generating
  useEffect(() => {
    if (!isGenerating) {
      // When done, flash to 100 then reset
      if (progress > 0) {
        setProgress(100);
        const timer = setTimeout(() => setProgress(0), 500);
        return () => clearTimeout(timer);
      }
      return;
    }

    setProgress(0);
    const start = Date.now();

    // MCP is instant, plugin takes ~60-120s
    const estimatedMs = activeMode === "mcp" ? 2000 : 90000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      // Asymptotic curve: approaches 95% but never reaches 100%
      const pct = Math.min(95, (elapsed / estimatedMs) * 100 * (1 - elapsed / (elapsed + estimatedMs)));
      setProgress(Math.round(pct));
    }, 300);

    return () => clearInterval(interval);
  }, [isGenerating, activeMode]);

  const modeLabel = activeMode === "plugin" ? "Generating with Plugin" : "Generating with MCP";
  const ModeIcon = activeMode === "plugin" ? Puzzle : Terminal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className={`border-border/50 bg-card ${disabled ? "opacity-60" : ""}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A259FF]/10">
              <Figma className="h-5 w-5 text-[#A259FF]" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Create a Landing Page</CardTitle>
              <CardDescription>
                Describe your landing page and choose how to generate it
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Describe your landing page... e.g. 'A modern SaaS landing page for a project management tool with a hero section, features grid, pricing table, and testimonials. Use a blue and white color scheme with clean typography.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[160px] resize-none border-border/50 bg-background text-base leading-relaxed placeholder:text-muted-foreground/60"
              disabled={isGenerating || disabled}
            />

            {disabled ? (
              <p className="text-xs text-muted-foreground">
                Connect your Figma account above to get started
              </p>
            ) : (
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3 rounded-lg border border-[#A259FF]/20 bg-[#A259FF]/5 px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-[#A259FF]" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">{modeLabel}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">{progress}%</span>
                        </div>
                        <Progress value={progress} className="mt-2 h-1.5" />
                      </div>
                    </div>
                    {activeMode === "plugin" && (
                      <p className="text-xs text-muted-foreground text-center">
                        Claude is designing your page. This usually takes 1–2 minutes.
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="buttons"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Choose generation method
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleSubmit("plugin")}
                        disabled={!prompt.trim() || disabled}
                        className="gap-2 h-auto py-3 px-4 bg-[#A259FF] hover:bg-[#8B3FE0] text-white"
                      >
                        <Puzzle className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">Generate with Plugin</div>
                          <div className="text-xs opacity-80 font-normal">
                            Use the Figma plugin to render
                          </div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => handleSubmit("mcp")}
                        disabled={!prompt.trim() || disabled}
                        variant="outline"
                        className="gap-2 h-auto py-3 px-4 border-border/50"
                      >
                        <Terminal className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">Generate with MCP</div>
                          <div className="text-xs text-muted-foreground font-normal">
                            Creates directly in your Figma
                          </div>
                        </div>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PromptForm;
