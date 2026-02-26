import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App";
import { AppWrapper } from "./components/common/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster, toast } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/tanstack";
import { ConfigProvider } from "antd";
import { tokenManager } from "./utils/tokenManager";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router";

const antTheme = {
  token: {
    colorPrimary: "#00A67D",
    colorPrimaryHover: "#00A67D",
    colorPrimaryActive: "#00A67D",
    controlOutline: "rgba(3, 46, 21, 0.15)",
  },
};

function AppWithTokenManager() {
  useEffect(() => {
    tokenManager.initialize();

    const handleSessionExpired = () => {
      toast.error("Sessiya tugadi. Iltimos, qaytadan kiring.", {
        duration: 5000,
      });
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={antTheme}>
          <ThemeProvider>
            <AuthProvider>
              <AppWrapper>
                <AppWithTokenManager />
              </AppWrapper>
            </AuthProvider>
          </ThemeProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
