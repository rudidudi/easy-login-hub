import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Figma, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  isGenerating?: boolean;
  disabled?: boolean;
}

const PromptForm = ({ onSubmit, isGenerating = false, disabled = false }: PromptFormProps) => {
  const [prompt, setPrompt] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = () => {
    if (!prompt.trim() || isGenerating) return;
    onSubmit(prompt.trim());
  };

  // Simulate progress while generating
  useEffect(() => {
    if (!isGenerating) {
      if (progress > 0) {
        setProgress(100);
        const timer = setTimeout(() => setProgress(0), 500);
        return () => clearTimeout(timer);
      }
      return;
    }

    setProgress(0);
    const start = Date.now();
    const estimatedMs = 120000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(95, (elapsed / estimatedMs) * 100 * (1 - elapsed / (elapsed + estimatedMs)));
      setProgress(Math.round(pct));
    }, 300);

    return () => clearInterval(interval);
  }, [isGenerating]);

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
                Describe your landing page and generate it directly in Figma
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
                          <span className="text-sm font-semibold text-foreground">Generating design...</span>
                          <span className="text-xs text-muted-foreground tabular-nums">{progress}%</span>
                        </div>
                        <Progress value={progress} className="mt-2 h-1.5" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Claude is designing your page directly in Figma. This usually takes 1–2 minutes.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      onClick={handleSubmit}
                      disabled={!prompt.trim() || disabled}
                      className="w-full gap-2 h-11 bg-[#A259FF] hover:bg-[#8B3FE0] text-white font-semibold"
                    >
                      <Figma className="h-4 w-4" />
                      Generate in Figma
                    </Button>
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
