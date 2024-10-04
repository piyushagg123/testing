import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./App.css";
import { AuthProvider } from "./context/Login.tsx";
import { StateProvider } from "./context/State.tsx";
import { ApiProvider } from "./context/Api.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApiProvider>
      <AuthProvider>
        <StateProvider>
          <QueryClientProvider client={queryClient}>
            <App />
            <Analytics />
          </QueryClientProvider>
        </StateProvider>
      </AuthProvider>
    </ApiProvider>
  </React.StrictMode>
);
