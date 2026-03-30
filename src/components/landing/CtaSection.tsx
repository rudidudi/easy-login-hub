import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import patternBg from "@/assets/pattern-bg.jpg";

const CtaSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
              Stop designing from scratch
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-primary-foreground/80">
              Write a prompt, get a landing page. It's that simple.
            </p>
            <Button
              size="lg"
              onClick={() => navigate(user ? "/dashboard" : "/login")}
              className="mt-8 rounded-xl bg-background px-8 text-base font-semibold text-primary hover:bg-background/90"
            >
              Get started free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
