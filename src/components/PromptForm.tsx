import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Figma, Loader2, Puzzle, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export type GenerationMode = "plugin" | "mcp";

interface PromptFormProps {
  onSubmit: (prompt: string, mode: GenerationMode) => void;
  isGenerating?: boolean;
  disabled?: boolean;
}

const PromptForm = ({ onSubmit, isGenerating = false, disabled = false }: PromptFormProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (mode: GenerationMode) => {
    if (!prompt.trim() || isGenerating) return;
    onSubmit(prompt.trim(), mode);
  };

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
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Choose generation method
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleSubmit("plugin")}
                    disabled={!prompt.trim() || isGenerating || disabled}
                    className="gap-2 h-auto py-3 px-4 bg-[#A259FF] hover:bg-[#8B3FE0] text-white"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Puzzle className="h-4 w-4" />
                    )}
                    <div className="text-left">
                      <div className="font-semibold text-sm">Generate with Plugin</div>
                      <div className="text-xs opacity-80 font-normal">
                        Use the Figma plugin to render
                      </div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => handleSubmit("mcp")}
                    disabled={!prompt.trim() || isGenerating || disabled}
                    variant="outline"
                    className="gap-2 h-auto py-3 px-4 border-border/50"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Terminal className="h-4 w-4" />
                    )}
                    <div className="text-left">
                      <div className="font-semibold text-sm">Generate with MCP</div>
                      <div className="text-xs text-muted-foreground font-normal">
                        For Claude Code + Figma MCP users
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PromptForm;
