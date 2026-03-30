import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Check, Eye, EyeOff, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showInfo, setShowInfo] = useState(false);
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
    toast({ title: "API key saved", description: "Stored locally in this browser." });
  };

  const handleRemove = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedKey(null);
    setApiKey("");
    setIsEditing(false);
    onKeyChange?.(false);
    toast({ title: "API key removed" });
  };

  // Saved state (compact)
  if (savedKey && !isEditing) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                <Check className="h-3.5 w-3.5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Anthropic</p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {showKey ? savedKey : maskKey(savedKey)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowKey(!showKey)}
                className="h-7 w-7 text-muted-foreground"
              >
                {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                className="h-7 w-7 text-muted-foreground"
              >
                {showInfo ? <X className="h-3 w-3" /> : <Info className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="mt-2 pt-2 border-t border-green-500/10 text-[11px] text-muted-foreground">
                  Your own API key is used for generation. Stored locally in your browser only. <button onClick={() => setIsEditing(true)} className="underline hover:text-foreground">Change key</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    );
  }

  // Input state
  return (
    <Card className="border-border/50 bg-card">
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Key className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              Anthropic <span className="text-[10px] font-normal text-muted-foreground">(optional)</span>
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(!showInfo)}
              className="h-7 w-7 text-muted-foreground"
            >
              {showInfo ? <X className="h-3 w-3" /> : <Info className="h-3 w-3" />}
            </Button>
            {!isEditing && !savedKey && (
              <Button onClick={() => setIsEditing(true)} size="sm" variant="outline" className="h-7 text-xs">
                Add key
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showInfo && !isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="mt-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                Add your own Anthropic API key to use your credits for generation. Stored locally in your browser.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                <div className="flex gap-1.5">
                  <Input
                    type={showKey ? "text" : "password"}
                    placeholder="sk-ant-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono text-xs h-8 min-w-0"
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowKey(!showKey)}
                    className="shrink-0 h-8 w-8"
                  >
                    {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={!apiKey.trim()} size="sm" className="h-7 text-xs flex-1">
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setIsEditing(false); setApiKey(""); }}
                    className="h-7 text-xs flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ApiKeySettings;
