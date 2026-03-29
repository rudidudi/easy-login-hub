import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Figma, Check, LogOut } from "lucide-react";
import { getFigmaConnection, getFigmaAuthUrl, clearFigmaConnection, FigmaConnection } from "@/lib/figma";
import { motion } from "framer-motion";

interface FigmaConnectProps {
  onConnectionChange: (connected: boolean) => void;
}

const FigmaConnect = ({ onConnectionChange }: FigmaConnectProps) => {
  const [connection, setConnection] = useState<FigmaConnection | null>(null);

  useEffect(() => {
    const stored = getFigmaConnection();
    setConnection(stored);
    onConnectionChange(!!stored);
  }, [onConnectionChange]);

  // Listen for connection updates from the callback page
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Connected to Figma
                </p>
                <p className="text-xs text-muted-foreground">
                  {connection.handle} ({connection.email})
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDisconnect} className="gap-2 text-muted-foreground">
              <LogOut className="h-3 w-3" />
              Disconnect
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-border/50 bg-card">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A259FF]/10">
              <Figma className="h-4 w-4 text-[#A259FF]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Connect your Figma account
              </p>
              <p className="text-xs text-muted-foreground">
                Required to generate landing pages in your Figma files
              </p>
            </div>
          </div>
          <Button onClick={handleConnect} className="gap-2">
            <Figma className="h-4 w-4" />
            Connect Figma
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FigmaConnect;
