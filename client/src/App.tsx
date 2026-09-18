import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Storefront from "./pages/Storefront";

export default function App() {
  const isStorefront = window.location.pathname.includes("/store");
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {isStorefront ? <Storefront /> : <Home />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
