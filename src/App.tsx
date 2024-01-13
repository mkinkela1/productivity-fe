import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import AllRoutes from "src/AllRoutes";
import { ModeToggle } from "src/components/mode-toggle";
import { ThemeProvider } from "src/components/theme-provider";
import AuthContextProvider from "src/contexts/AuthContext";
import ServiceWorkerContextProvider from "src/contexts/ServiceWorkerContext";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ServiceWorkerContextProvider>
          <AuthContextProvider>
            <Toaster richColors />
            <Router>
              <ModeToggle />
              <AllRoutes />
            </Router>
          </AuthContextProvider>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </ServiceWorkerContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
