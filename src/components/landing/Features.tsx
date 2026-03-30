import { motion } from "framer-motion";
import { Zap, Shield, Clock } from "lucide-react";

const features = [
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
];

const Features = () => (
  <section id="features" className="border-t border-border/40 bg-secondary/30 py-24">
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
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Everything a designer needs to go from idea to Figma in record time.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
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
);

export default Features;
