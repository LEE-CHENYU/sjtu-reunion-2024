import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/ui/Navigation";
import Home from "./pages/Home";
import Survey from "./pages/Survey";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/survey" component={Survey} />
        <Route path="/community" component={Community} />
        <Route path="/dashboard" component={Dashboard} />
        <Route>404 Page Not Found</Route>
      </Switch>
      <Toaster />
    </SWRConfig>
  </StrictMode>,
);
