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
import AccountSettings from "src/pages/account-settings/AccountSettings";
import Calendar from "src/pages/calendar/Calendar";
import Chat from "src/pages/chat/Chat";
import Home from "src/pages/home/Home";
import Login from "src/pages/login/Login";
import Notes from "src/pages/notes/Notes";
import Rewards from "src/pages/rewards/Rewards";
import SignOut from "src/pages/sign-out/SignOut";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ServiceWorkerContextProvider>
        <AuthContextProvider>
          <Router>
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
                <Route path="calendar" element={<Calendar />} />
                <Route path="notes" element={<Notes />} />
                <Route path="chat" element={<Chat />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="account-settings" element={<AccountSettings />} />
                <Route path="sign-out" element={<SignOut />} />
                <Route path="*" element={<Navigate to="/app/home" replace />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthContextProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </ServiceWorkerContextProvider>
    </QueryClientProvider>
  );
}

export default App;
