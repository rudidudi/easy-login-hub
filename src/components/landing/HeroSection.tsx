import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles, Mail, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroMockup from "@/assets/hero-mockup.jpg";

const HeroSection = () => {
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
        toast({ title: "You're already on the list!", description: "We'll notify you when we launch." });
        setSubmitted(true);
      } else {
        toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      }
    } else {
      setSubmitted(true);
      toast({ title: "You're in! 🎉", description: "We'll send you an update when Designfolio launches." });
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Coming Soon Banner */}
      <div className="relative z-20 border-b border-primary/20 bg-primary/5">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          <span>Coming Soon — Join the waitlist and be the first to know!</span>
        </div>
      </div>

      <div className="pointer-events-none absolute -left-60 top-20 h-[600px] w-[600px] rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Coming Soon
            </div>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Describe it.
              <br />
              <span className="text-primary">AI designs it.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Turn a text prompt into a complete landing page in your favorite design tool like Figma and Canvas.<br />No manual design work needed.
            </p>
            <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Figma
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                Canva — coming soon
              </span>
            </div>

            {/* Waitlist form */}
            <div className="mt-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300"
                >
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-medium">You're on the list! We'll email you when we launch.</p>
                </motion.div>
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
                      className="h-12 rounded-xl pl-10 text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="h-12 rounded-xl px-8 text-base font-semibold"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining…
                      </>
                    ) : (
                      "Join the waitlist"
                    )}
                  </Button>
                </form>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                No spam, ever. We'll only email you when Designfolio is ready.
              </p>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
              <img
                src={heroMockup}
                alt="Designfolio AI design workspace showing Figma-style interface"
                width={1280}
                height={800}
                className="w-full"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5" />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-card px-4 py-3 shadow-lg sm:-bottom-6 sm:-left-6"
            >
              <p className="text-xs font-medium text-muted-foreground">Generated in</p>
              <p className="text-2xl font-black text-primary">~2 min</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
