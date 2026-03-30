import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Terminal, Puzzle, Zap, Shield, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/30 bg-card/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <span className="text-sm font-black text-primary-foreground">D</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Designfolio</span>
          </div>
          <Button
            onClick={() => navigate(user ? "/dashboard" : "/login")}
            className="rounded-xl font-semibold"
          >
            {user ? "Dashboard" : "Get Started"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-60 top-20 h-[600px] w-[600px] rounded-full bg-[#A259FF]/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Prompt to Design
            </div>
            <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-foreground sm:text-7xl">
              Describe it.
              <br />
              <span className="text-[#A259FF]">AI designs it.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Turn a text prompt into a complete landing page in your favorite design tool. Powered by Claude AI — no manual design work needed.
            </p>
            <div className="mt-5 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Figma
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                Canva — coming soon
              </span>
            </div>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={() => navigate(user ? "/dashboard" : "/login")}
                className="rounded-xl px-8 text-base font-semibold bg-[#A259FF] hover:bg-[#8B3FE0]"
              >
                Start generating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/30 bg-secondary/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Three steps from idea to Figma design.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Write your prompt",
                desc: "Describe the landing page you want — layout, sections, colors, content. Be as detailed or as brief as you like.",
              },
              {
                step: "02",
                title: "AI generates the design",
                desc: "Claude AI translates your prompt into Figma Plugin API code — a full page with header, hero, features, CTA, and footer.",
              },
              {
                step: "03",
                title: "It appears in Figma",
                desc: "Open the Designfolio plugin, enter your code, and the landing page renders directly on your Figma canvas. Ready to edit.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-border/50 bg-card p-8"
              >
                <span className="text-sm font-bold text-[#A259FF]">{item.step}</span>
                <h3 className="mt-3 text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Two generation modes */}
      <section className="border-t border-border/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Two ways to generate
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Choose the method that fits your workflow.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group rounded-2xl border border-[#A259FF]/30 bg-[#A259FF]/5 p-8 transition-all hover:border-[#A259FF]/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#A259FF]/10">
                <Puzzle className="h-6 w-6 text-[#A259FF]" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">Generate with Plugin</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Write your prompt in the app, get a 6-character code, paste it into the Designfolio Figma plugin. The design renders on your canvas instantly.
              </p>
              <p className="mt-4 text-xs font-medium text-[#A259FF]">
                Requires the Designfolio Figma plugin
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 transition-all hover:border-emerald-500/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Terminal className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">Generate with MCP</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                For developers with Claude Code and Figma MCP connected. Copy the formatted prompt and paste it into Claude Code — it creates the design directly.
              </p>
              <p className="mt-4 text-xs font-medium text-emerald-500">
                Requires Claude Code + Figma MCP server
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/30 bg-secondary/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Built for speed
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Prompt to page in minutes",
                desc: "Skip the blank canvas. Describe what you want and get a structured landing page with real sections, spacing, and typography.",
              },
              {
                icon: Shield,
                title: "Your own API key",
                desc: "Bring your own Anthropic key to control costs. Or use the default plan — your choice.",
              },
              {
                icon: Clock,
                title: "Fully editable output",
                desc: "Everything renders as native Figma frames, text, and auto-layout. Edit, tweak, and ship like any other Figma file.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Stop designing from scratch
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Write a prompt, get a landing page. It's that simple.
            </p>
            <Button
              size="lg"
              onClick={() => navigate(user ? "/dashboard" : "/login")}
              className="mt-8 rounded-xl px-8 text-base font-semibold bg-[#A259FF] hover:bg-[#8B3FE0]"
            >
              Get started free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <span className="text-sm text-muted-foreground">© 2026 Designfolio</span>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-black text-primary-foreground">D</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
