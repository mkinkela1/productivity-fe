import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import RequireAuth from "src/components/RequireAuth/RequireAuth";
import DashboardLayout from "src/layouts/Dashboard/DashboardLayout";
import UnauthLayout from "src/layouts/Unauth/UnauthLayout";
import AccountSettings from "src/pages/account-settings/AccountSettings";
import Calendar from "src/pages/calendar/Calendar";
import Chat from "src/pages/chat/Chat";
import Home from "src/pages/home/Home";
import Login from "src/pages/login/Login";
import EditNote from "src/pages/notes/EditNote";
import EmptyNote from "src/pages/notes/EmptyNote";
import NewNote from "src/pages/notes/NewNote";
import NotesLayout from "src/pages/notes/NotesLayout";
import Rewards from "src/pages/rewards/Rewards";
import SignOut from "src/pages/sign-out/SignOut";

const AllRoutes = () => {
  const location = useLocation();
  const hasBackground = location?.state?.background;

  return (
    <>
      <Routes location={hasBackground || location}>
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
          <Route path="notes" element={<NotesLayout />}>
            <Route index path="" element={<EmptyNote />} />
            <Route path="new" element={<NewNote />} />
            <Route path=":noteId" element={<EditNote />} />
          </Route>
          <Route path="chat" element={<Chat />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="account-settings" element={<AccountSettings />} />
          <Route path="sign-out" element={<SignOut />} />
          <Route path="*" element={<Navigate to="/app/home" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {hasBackground && (
        <Routes>
          <Route path="/app/notes/new" element={<NewNote />} />
        </Routes>
      )}
    </>
  );
};

export default AllRoutes;
