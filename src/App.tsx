import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import RequireAuth from "src/components/RequireAuth/RequireAuth";
import AuthContextProvider from "src/contexts/AuthContext";
import ServiceWorkerContextProvider from "src/contexts/ServiceWorkerContext";
import DashboardLayout from "src/layouts/Dashboard/DashboardLayout";
import UnauthLayout from "src/layouts/Unauth/UnauthLayout";
import Home from "src/pages/home/Home";
import Login from "src/pages/login/Login";
import Users from "src/pages/users/Users";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  return (
    <ServiceWorkerContextProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthContextProvider>
            <Routes>
              <Route element={<UnauthLayout />}>
                <Route path="/" element={<Login />} />
              </Route>
              <Route
                path="/app"
                element={
                  <RequireAuth>
                    <DashboardLayout />
                  </RequireAuth>
                }
              >
                <Route path="home" element={<Home />} />
                <Route path="users" element={<Users />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthContextProvider>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </ServiceWorkerContextProvider>
  );
}

export default App;
