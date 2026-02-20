import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import AccessibilityPanel from "./components/AccessibilityPanel";
import Home from "./pages/Home";
import Quote from "./pages/Quote";
import Coverage from "./pages/Coverage";
import Verticals from "./pages/Verticals";
import Compliance from "./pages/Compliance";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Compare from "./pages/Compare";
import AIChatAssistant from "./components/AIChatAssistant";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quote" component={Quote} />
      <Route path="/coverage" component={Coverage} />
      <Route path="/verticals" component={Verticals} />
      <Route path="/compliance" component={Compliance} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Admin} />
      <Route path="/compare" component={Compare} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AccessibilityProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <AccessibilityPanel />
            <AIChatAssistant />
          </TooltipProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
