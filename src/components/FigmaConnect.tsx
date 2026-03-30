import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Figma, Check, LogOut, Info, X } from "lucide-react";
import { getFigmaConnection, getFigmaAuthUrl, clearFigmaConnection, FigmaConnection } from "@/lib/figma";
import { motion, AnimatePresence } from "framer-motion";

interface FigmaConnectProps {
  onConnectionChange: (connected: boolean) => void;
}

const FigmaConnect = ({ onConnectionChange }: FigmaConnectProps) => {
  const [connection, setConnection] = useState<FigmaConnection | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const stored = getFigmaConnection();
    setConnection(stored);
    onConnectionChange(!!stored);
  }, [onConnectionChange]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "figma_connection") {
        const stored = getFigmaConnection();
        setConnection(stored);
        onConnectionChange(!!stored);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [onConnectionChange]);

  const handleConnect = () => {
    const state = crypto.randomUUID();
    sessionStorage.setItem("figma_oauth_state", state);
    window.location.href = getFigmaAuthUrl(state);
  };

  const handleDisconnect = () => {
    clearFigmaConnection();
    setConnection(null);
    onConnectionChange(false);
  };

  if (connection) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                <Check className="h-3.5 w-3.5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Figma</p>
                <p className="text-[11px] text-muted-foreground">{connection.handle}</p>
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
                onClick={handleDisconnect}
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-3 w-3" />
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
                  Connected as <strong>{connection.handle}</strong> ({connection.email}). Figma is used to render your generated landing pages via the Designfolio plugin.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A259FF]/10">
              <Figma className="h-3.5 w-3.5 text-[#A259FF]" />
            </div>
            <p className="text-sm font-semibold text-foreground">Figma</p>
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
            <Button onClick={handleConnect} size="sm" className="h-7 text-xs gap-1.5">
              Connect
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
              <p className="mt-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                Connect your Figma account to generate landing pages directly on your canvas via the Designfolio plugin.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default FigmaConnect;
