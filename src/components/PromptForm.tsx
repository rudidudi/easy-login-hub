import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Figma, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  isGenerating?: boolean;
  disabled?: boolean;
}

const PromptForm = ({ onSubmit, isGenerating = false, disabled = false }: PromptFormProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onSubmit(prompt.trim());
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
                Describe your landing page and we'll generate it in Figma
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Describe your landing page... e.g. 'A modern SaaS landing page for a project management tool with a hero section, features grid, pricing table, and testimonials. Use a blue and white color scheme with clean typography.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[160px] resize-none border-border/50 bg-background text-base leading-relaxed placeholder:text-muted-foreground/60"
              disabled={isGenerating || disabled}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {disabled
                  ? "Connect your Figma account above to get started"
                  : "Your prompt will be used to generate a Figma landing page via MCP"}
              </p>
              <Button
                type="submit"
                disabled={!prompt.trim() || isGenerating || disabled}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate in Figma
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PromptForm;
