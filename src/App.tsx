import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import Admin from "./dashboards/admin";
import SuperAdmin from "./dashboards/super_admin";
import Teacher from "./dashboards/teacher";
import Student from "./dashboards/student";
import Parent from "./dashboards/parent";

import Teachers from "./pages/Teachers/Teachers";
import Students from "./pages/Students/Students";
import Parents from "./pages/Parents/Parents";
import Attendance from "./pages/Attendance/Attendance";
import Groups from "./pages/Groups/Groups";
import Rooms from "./pages/Rooms/Rooms";
import Grades from "./pages/Grades/Grades";
import Assessnment from "./pages/Assessnment/Assessnment";
import Messages from "./pages/Messages/Messages";
import Admins from "./pages/Admins/Admins";
import AttendanceHistory from "./pages/AttendanceHistory/AttendanceHistory";

import { Toaster } from "sonner";
import { useTheme } from "./context/ThemeContext";
import "./i18n";
import { useAuthContext } from "./context/AuthContext";
import RoomsID from "./pages/RoomsID/RoomsID";

const ROLE_REDIRECTS: Record<string, string> = {
  ROLE_SUPER_ADMIN: "/dashboard/super_admin",
  ROLE_ADMIN: "/dashboard/admin",
  ROLE_TEACHER: "/dashboard/teacher",
  ROLE_STUDENT: "/dashboard/student",
  ROLE_PARENT: "/dashboard/parent",
};

const getRoleRedirectPath = (role: string | null) => {
  return role ? ROLE_REDIRECTS[role] || "/dashboard/teacher" : "/signin";
};

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
    </div>
  </div>
);

const RootRedirect: React.FC = () => {
  const { role } = useAuthContext();
  return <Navigate to={getRoleRedirectPath(role)} replace />;
};

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isVerifying, role } = useAuthContext();

  if (isVerifying) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to={getRoleRedirectPath(role)} replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isVerifying, role } = useAuthContext();

  if (isVerifying) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleRedirectPath(role)} replace />;
  }

  return <>{children}</>;
};
export default function App() {
  const { theme } = useTheme();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("Internet bor");
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("Internet yo‘q");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => window.history.go(1);
    return () => {
      window.onpopstate = null;
    };
  }, []);

  return (
    <Router>
      {!isOnline && (
        <div
          style={{
            background: "red",
            color: "white",
            padding: "10px",
            textAlign: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 9999,
          }}
        >
          Internet yo‘q. Iltimos, ulanishni tekshiring.
        </div>
      )}
      <ScrollToTop />
      <Routes>
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<RootRedirect />} />

          <Route
            path="dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/super_admin"
            element={
              <ProtectedRoute allowedRoles={["ROLE_SUPER_ADMIN"]}>
                <SuperAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/teacher"
            element={
              <ProtectedRoute allowedRoles={["ROLE_TEACHER"]}>
                <Teacher />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/student"
            element={
              <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                <Student />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/parent"
            element={
              <ProtectedRoute allowedRoles={["ROLE_PARENT"]}>
                <Parent />
              </ProtectedRoute>
            }
          />

          {/* Users */}
          <Route path="teachers" element={<Teachers />} />
          <Route path="admins" element={<Admins />} />
          <Route path="students" element={<Students />} />
          <Route path="parents" element={<Parents />} />

          {/* Messages & Grades */}
          <Route path="messages" element={<Messages />} />
          <Route path="grades" element={<Grades />} />
          <Route path="assessment" element={<Assessnment />} />

          {/* Attendance */}
          <Route path="attendance" element={<Attendance />} />
          <Route path="history-attendance" element={<AttendanceHistory />} />

          {/* Groups & Rooms */}
          <Route path="groups" element={<Groups />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="room/:id" element={<RoomsID />} />

          {/* Others Pages */}
          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />

          {/* Forms */}
          <Route path="form-elements" element={<FormElements />} />

          {/* Tables */}
          <Route path="basic-tables" element={<BasicTables />} />

          {/* UI Elements */}
          <Route path="alerts" element={<Alerts />} />
          <Route path="avatars" element={<Avatars />} />
          <Route path="badge" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="images" element={<Images />} />
          <Route path="videos" element={<Videos />} />

          {/* Charts */}
          <Route path="line-chart" element={<LineChart />} />
          <Route path="bar-chart" element={<BarChart />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toaster */}
      <Toaster
        position="top-right"
        richColors
        theme={theme === "dark" ? "dark" : "light"}
      />
    </Router>
  );
}
