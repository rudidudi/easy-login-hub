import { motion } from "framer-motion";
import { Zap, Shield, Sparkles } from "lucide-react";

const GenerationModes = () => (
  <section className="border-t border-border/40 py-24">
    <div className="mx-auto max-w-7xl px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Direct to your design tool
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          No plugins, no copy-paste. Your design appears directly in Figma.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-primary/20 bg-accent/40 p-8 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-5 text-lg font-bold text-foreground">One-click generation</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
            Describe your page, hit generate, and the design is created directly in your Figma file. No extra steps.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-green-500/20 bg-green-500/5 p-8 transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
            <Shield className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="mt-5 text-lg font-bold text-foreground">Secure connection</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
            Connect once via Figma OAuth. Your credentials stay safe and your designs land in your own account.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-8 transition-all hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
            <Sparkles className="h-6 w-6 text-orange-500" />
          </div>
          <h3 className="mt-5 text-lg font-bold text-foreground">AI-powered design</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
            Claude understands design principles and creates production-quality layouts with proper spacing, typography, and hierarchy.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default GenerationModes;
