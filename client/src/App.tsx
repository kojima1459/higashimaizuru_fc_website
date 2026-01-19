import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingActionButton from "./components/FloatingActionButton";
import Home from "./pages/Home";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Schedule from "./pages/Schedule";
import Results from "./pages/Results";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Bbs from "./pages/Bbs";
import Admin from "./pages/Admin";
import AdminManagement from "./pages/AdminManagement";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/news" component={News} />
          <Route path="/news/:id" component={NewsDetail} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/results" component={Results} />
          <Route path="/team" component={Team} />
          <Route path="/contact" component={Contact} />
          <Route path="/bbs" component={Bbs} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/management" component={AdminManagement} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <FloatingActionButton />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
