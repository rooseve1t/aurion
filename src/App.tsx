import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { I18nProvider } from "./contexts/I18nContext";
import AurionOS from "./pages/AurionOS";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={AurionOS} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <I18nProvider>
          <TooltipProvider>
            <Toaster
              theme="dark"
              toastOptions={{
                style: {
                  background: 'oklch(0.09 0.015 240 / 95%)',
                  border: '1px solid oklch(0.72 0.18 200 / 30%)',
                  color: 'oklch(0.92 0.02 200)',
                  backdropFilter: 'blur(16px)',
                }
              }}
            />
            <Router />
          </TooltipProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
