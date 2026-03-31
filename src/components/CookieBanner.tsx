import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "designfolio_cookie_consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/10 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Cookie className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">
                  We use cookies
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  We use essential cookies to keep the app running and optional analytics cookies to improve your experience. No data is sold to third parties.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleAccept}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    Accept all
                  </Button>
                  <Button
                    onClick={handleDecline}
                    size="sm"
                    variant="outline"
                    className="border-border/50"
                  >
                    Essential only
                  </Button>
                </div>
              </div>

              <button
                onClick={handleDecline}
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
