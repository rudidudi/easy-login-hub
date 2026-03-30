import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <span className="text-sm font-black text-primary-foreground">D</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">Designfolio</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:block">
            How it works
          </a>
          <a href="#features" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:block">
            Features
          </a>
          <Button
            onClick={() => navigate(user ? "/dashboard" : "/login")}
            className="rounded-xl font-semibold"
          >
            {user ? "Dashboard" : "Get Started"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
