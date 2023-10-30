import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import AllRoutes from "src/AllRoutes";
import AuthContextProvider from "src/contexts/AuthContext";
import ServiceWorkerContextProvider from "src/contexts/ServiceWorkerContext";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ServiceWorkerContextProvider>
        <AuthContextProvider>
          <Toaster richColors />
          <Router>
            <AllRoutes />
          </Router>
        </AuthContextProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </ServiceWorkerContextProvider>
    </QueryClientProvider>
  );
}

export default App;
