import { motion } from "framer-motion";
import { Puzzle, Terminal } from "lucide-react";

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
          className="group rounded-2xl border border-primary/20 bg-accent/40 p-8 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Puzzle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-foreground">Generate with Plugin</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Write your prompt in the app, get a 6-character code, paste it into the Designfolio Figma plugin. The design renders on your canvas instantly.
          </p>
          <p className="mt-4 text-xs font-medium text-primary">
            Requires the Designfolio Figma plugin
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group rounded-2xl border border-green-500/20 bg-green-500/5 p-8 transition-all hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
            <Terminal className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-foreground">Generate with MCP</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            For developers with Claude Code and Figma MCP connected. Copy the formatted prompt and paste it into Claude Code — it creates the design directly.
          </p>
          <p className="mt-4 text-xs font-medium text-green-600 dark:text-green-400">
            Requires Claude Code + Figma MCP server
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default GenerationModes;
