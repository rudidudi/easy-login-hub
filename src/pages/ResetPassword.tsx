import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check for recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "You can now log in with your new password." });
      navigate("/login");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-4 flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-border/50 bg-card/80 p-10 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <span className="text-2xl font-black tracking-tight text-primary-foreground">D</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Set new password</h1>
        </div>

        {ready ? (
          <form onSubmit={handleReset} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" size="lg" className="w-full rounded-xl font-semibold" disabled={submitting}>
              {submitting ? "Updating…" : "Update password"}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Loading… If this takes too long, please request a new reset link.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
