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
import Login from "src/pages/login/Login";
import Users from "src/pages/users/Users";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/users"
              element={
                <RequireAuth>
                  <Users />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthContextProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
