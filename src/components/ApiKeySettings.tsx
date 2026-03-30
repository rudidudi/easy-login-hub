import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Check, Eye, EyeOff, X } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "anthropic_api_key";

export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function maskKey(key: string): string {
  if (key.length <= 12) return "****";
  return key.slice(0, 7) + "..." + key.slice(-4);
}

interface ApiKeySettingsProps {
  onKeyChange?: (hasKey: boolean) => void;
}

const ApiKeySettings = ({ onKeyChange }: ApiKeySettingsProps) => {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const stored = getStoredApiKey();
    setSavedKey(stored);
    onKeyChange?.(!!stored);
  }, [onKeyChange]);

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("sk-ant-")) {
      toast({
        title: "Invalid API key",
        description: "Anthropic API keys start with 'sk-ant-'",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem(STORAGE_KEY, trimmed);
    setSavedKey(trimmed);
    setApiKey("");
    setIsEditing(false);
    onKeyChange?.(true);
    toast({ title: "API key saved", description: "Your key is stored locally in this browser." });
  };

  const handleRemove = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedKey(null);
    setApiKey("");
    setIsEditing(false);
    onKeyChange?.(false);
    toast({ title: "API key removed" });
  };

  if (savedKey && !isEditing) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border/50 bg-card">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                <Key className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Your Anthropic API Key
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {showKey ? savedKey : maskKey(savedKey)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowKey(!showKey)}
                className="h-8 w-8"
              >
                {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-muted-foreground"
              >
                Change
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border/50 bg-card">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <Key className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Anthropic API Key <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Use your own key to generate designs. Stored locally in your browser only.
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="sk-ant-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                  className="shrink-0"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button onClick={handleSave} disabled={!apiKey.trim()} className="shrink-0 gap-2">
                  <Check className="h-4 w-4" />
                  Save
                </Button>
                {isEditing && (
                  <Button
                    variant="ghost"
                    onClick={() => { setIsEditing(false); setApiKey(""); }}
                    className="shrink-0"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ApiKeySettings;
