import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import patternBg from "@/assets/pattern-bg.jpg";

const CtaSection = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const { error } = await supabase.from("waitlist").insert({ email: email.trim().toLowerCase() });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        toast({ title: "You're already on the list!" });
        setSubmitted(true);
      } else {
        toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      }
    } else {
      setSubmitted(true);
      toast({ title: "You're in! 🎉", description: "We'll notify you when we launch." });
    }
  };

  return (
    <section className="border-t border-border/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <img
            src={patternBg}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="relative px-8 py-20 text-center sm:px-16">
            <h2 className="text-3xl font-black tracking-tight text-primary-foreground sm:text-4xl">
              Be the first to try Designfolio
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-primary-foreground/80">
              Sign up for early access and we'll let you know the moment we launch.
            </p>
            <div className="mx-auto mt-8 max-w-md">
              {submitted ? (
                <div className="flex items-center justify-center gap-2 text-primary-foreground">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">You're on the list!</span>
                </div>
              ) : (
                <form onSubmit={handleWaitlist} className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 rounded-xl bg-background pl-10 text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="h-12 rounded-xl bg-background px-8 text-base font-semibold text-primary hover:bg-background/90"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join waitlist"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
