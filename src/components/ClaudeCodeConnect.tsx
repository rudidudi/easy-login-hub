import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Terminal, Check, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "claude_code_pair";
const AGENT_URL = "https://designfolio-agent-production.up.railway.app";

export function getStoredPairCode(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

interface ClaudeCodeConnectProps {
  onConnectionChange?: (connected: boolean) => void;
}

const ClaudeCodeConnect = ({ onConnectionChange }: ClaudeCodeConnectProps) => {
  const [pairCode, setPairCode] = useState("");
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const stored = getStoredPairCode();
    setSavedCode(stored);
    onConnectionChange?.(!!stored);
  }, [onConnectionChange]);

  const handleVerify = async () => {
    const code = pairCode.trim().toUpperCase();
    if (!code) return;

    setVerifying(true);
    try {
      const res = await fetch(`${AGENT_URL}/pair/${code}`);
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem(STORAGE_KEY, code);
        setSavedCode(code);
        setPairCode("");
        setIsEditing(false);
        onConnectionChange?.(true);
        toast({ title: "Claude Code connected", description: "Figma MCP token linked successfully." });
      } else {
        toast({
          title: "Invalid pair code",
          description: data.error || "Code not found or expired. Run npx designfolio-connect again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: "Connection error", description: "Could not reach the server.", variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  const handleRemove = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedCode(null);
    setPairCode("");
    setIsEditing(false);
    onConnectionChange?.(false);
    toast({ title: "Claude Code disconnected" });
  };

  // Connected state
  if (savedCode && !isEditing) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                <Check className="h-3.5 w-3.5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Claude Code</p>
                <p className="text-[11px] text-muted-foreground font-mono">{savedCode}</p>
              </div>
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
                  Linked via Figma MCP token from Claude Code. Enables direct design generation in Figma without the plugin. <button onClick={() => setIsEditing(true)} className="underline hover:text-foreground">Update code</button>
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Terminal className="h-3.5 w-3.5 text-violet-500" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              Claude Code <span className="text-[10px] font-normal text-muted-foreground">(optional)</span>
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
            {!isEditing && !savedCode && (
              <Button onClick={() => setIsEditing(true)} size="sm" variant="outline" className="h-7 text-xs">
                Link
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
                Link your Claude Code Figma MCP token to generate designs directly in Figma. Run <code className="bg-muted px-1 rounded text-[10px]">npx designfolio-connect</code> in your terminal to get a pair code.
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
              <p className="mt-2 mb-2 text-[11px] text-muted-foreground">
                Run <code className="bg-muted px-1 rounded text-[10px]">npx designfolio-connect</code> in your terminal, then enter the code:
              </p>
              <div className="space-y-2">
                <div className="flex gap-1.5 overflow-hidden">
                  <div className="flex-1 min-w-0">
                    <Input
                      type="text"
                      placeholder="e.g. A1B2C3"
                      value={pairCode}
                      onChange={(e) => setPairCode(e.target.value.toUpperCase())}
                      className="font-mono text-xs h-8 w-full uppercase tracking-widest"
                      onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleVerify}
                    disabled={!pairCode.trim() || verifying}
                    size="sm"
                    className="h-7 text-xs flex-1"
                  >
                    {verifying ? "Verifying..." : "Link"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setIsEditing(false); setPairCode(""); }}
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

export default ClaudeCodeConnect;
