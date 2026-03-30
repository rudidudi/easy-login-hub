import { motion } from "framer-motion";
import workflowIllustration from "@/assets/workflow-illustration.jpg";

const steps = [
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
];

const HowItWorks = () => (
  <section id="how-it-works" className="border-t border-border/40 bg-secondary/30 py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={workflowIllustration}
            alt="Designer workflow: wireframing, color selection, responsive preview"
            width={1024}
            height={640}
            loading="lazy"
            className="w-full rounded-2xl border border-border shadow-lg"
          />
        </motion.div>

        {/* Steps */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Three steps from idea to Figma design.
            </p>
          </motion.div>

          <div className="mt-10 space-y-6">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-5 rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
