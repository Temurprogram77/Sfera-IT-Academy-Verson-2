import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";

import Admin from "./dashboards/admin";
import SuperAdmin from "./dashboards/super_admin";
import Teacher from "./dashboards/teacher";
import Student from "./dashboards/student";
import Parent from "./dashboards/parent";

import Teachers from "./pages/Teachers/Teachers";
import Students from "./pages/Students/Students";
import Parents from "./pages/Parents/Parents";
import Groups from "./pages/Groups/Groups";
import Rooms from "./pages/Rooms/Rooms";
import Grades from "./pages/Grades/Grades";
import Messages from "./pages/Messages/Messages";
import Admins from "./pages/Admins/Admins";
import RoomsID from "./pages/RoomsID/RoomsID";
import Attendance from "./pages/Attendance/Attendance";

import { Toaster } from "sonner";
import { useTheme } from "./context/ThemeContext";
import { useAuthContext } from "./context/AuthContext";
import { ScrollToTop } from "./components/common/ScrollToTop";
import "./i18n";
import { ConfigProvider, theme as antdTheme } from "antd";

import GroupsDetail from "./pages/groupsDetail/groupsDetail";
import StudentsDetail from "./pages/StudentsDetail/StudentsDetail";
import TeachersDetail from "./pages/TeachersDetail/TeachersDetail";
import AdminsDetail from "./pages/AdminsDetail/AdminsDetail";
import ParentsDetail from "./pages/ParentsDetail/ParentsDetail";
import Categories from "./pages/Categories/Categories";
import CategoryDetail from "./pages/CategoryDetail/CategoryDetail";
import AttendanceGroup from "./pages/Attendance/AttendanceGroup";
import News from "./pages/News/News";
import TeacherGroups from "./pages/Grades/Assessment";
import SingleAssessment from "./pages/Grades/GroupAssessment";
import MyGrades from "./pages/myGrades/MyGrades";
import Presence from "./pages/Attendance/Presence";
import PresenceGroup from "./pages/Attendance/PresenceGroup";
import MyChildsGrades from "./pages/MyChildsGrades/MyChildsGrades";
import MyChildsDetail from "./pages/MyChildsDetail/MyChildsDetail";
import RegisterForm from "./components/auth/RegisterForm";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[]; // ruxsat berilgan rollar
}

// 5 ta role uchun redirect xaritasi
const ROLE_REDIRECTS: Record<string, string> = {
  ROLE_SUPER_ADMIN: "/dashboard/super_admin",
  ROLE_ADMIN: "/dashboard/admin",
  ROLE_TEACHER: "/dashboard/teacher",
  ROLE_STUDENT: "/dashboard/student",
  ROLE_PARENT: "/dashboard/parent",
};

// role asosida redirect path olish
const getRoleRedirectPath = (role: string | null) => {
  return role ? ROLE_REDIRECTS[role] || "/dashboard/teacher" : "/signin";
};

// bosh sahifa uchun redirect
const RootRedirect: React.FC = () => {
  const { role } = useAuthContext();
  return <Navigate to={getRoleRedirectPath(role)} replace />;
};

// Protected Route
function ProtectedRoute({ children, allowedRoles }: Props) {
  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("user_role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    if (role === "ROLE_ADMIN")
      return <Navigate to="/dashboard/admin" replace />;
    if (role === "ROLE_TEACHER")
      return <Navigate to="/dashboard/teacher" replace />;
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

// Public Route
function PublicRoute({ children }: Props) {
  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("user_role");

  if (token && role && ROLE_REDIRECTS[role]) {
    return <Navigate to={ROLE_REDIRECTS[role]} replace />;
  }

  return <>{children}</>;
}

// App Component
export default function App() {
  const { theme } = useTheme();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorBgContainer: theme === "dark" ? "#111827" : "#ffffff",
          colorText: theme === "dark" ? "#e5e7eb" : "#111827",
          colorBorder: theme === "dark" ? "#374151" : "#e5e7eb",
        },
        components: {
          Modal: {
            contentBg: theme === "dark" ? "#111827" : "#ffffff",
            headerBg: theme === "dark" ? "#111827" : "#ffffff",
            footerBg: theme === "dark" ? "#111827" : "#ffffff",
          },
          Select: {
            colorBgContainer: theme === "dark" ? "#1f2937" : "#ffffff",
            colorText: theme === "dark" ? "#e5e7eb" : "#000000",
            colorBorder: theme === "dark" ? "#4b5563" : "#d9d9d9",
          },
          Input: {
            colorBgContainer: theme === "dark" ? "#1f2937" : "#ffffff",
            colorText: theme === "dark" ? "#e5e7eb" : "#111827",
            colorBorder: theme === "dark" ? "#374151" : "#d1d5db",
            activeBorderColor: theme === "dark" ? "#3b82f6" : "#1890ff",
          },
          Popconfirm: {
            colorBgElevated: theme === "dark" ? "#1f2937" : "#ffffff",
            colorText: theme === "dark" ? "#e5e7eb" : "#111827",
            colorBorder: theme === "dark" ? "#374151" : "#d1d5db",
          },
          Table: {
            colorBgContainer: theme === "dark" ? "#1f2937" : "#ffffff",
            colorText: theme === "dark" ? "#e5e7eb" : "#111827",
            colorBorder: theme === "dark" ? "#374151" : "#d1d5db",
          },
        },
      }}
    >
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
          Internet yo‘q. Iltimos, tarmoqni tekshiring.
        </div>
      )}
      <ScrollToTop />
      <Routes>
        {/* Auth */}
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<RootRedirect />} />

          {/* Dashboards */}
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
          <Route path="teachers/:id" element={<TeachersDetail />} />
          <Route path="admins" element={<Admins />} />
          <Route path="admins/:id" element={<AdminsDetail />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentsDetail />} />
          <Route path="parents" element={<Parents />} />
          <Route path="parents/:id" element={<ParentsDetail />} />
          <Route path="my-childs-grades" element={<MyChildsGrades />} />
          <Route path="my-childs/:id" element={<MyChildsDetail />} />

          {/* Messages & Grades */}
          <Route path="messages" element={<Messages />} />
          <Route path="grades" element={<Grades />} />
          <Route path="my-grades" element={<MyGrades />} />

          {/* Attendance */}
          <Route path="attendance/group/:id" element={<Attendance />} />
          <Route path="attendance" element={<AttendanceGroup />} />
          <Route path="presence/:id" element={<Presence />} />
          <Route path="presence" element={<PresenceGroup />} />

          {/* News */}
          <Route path="news" element={<News />} />

          {/* Categories & Groups */}
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:id" element={<CategoryDetail />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:id" element={<GroupsDetail />} />

          {/* Assessment */}
          <Route path="assessment" element={<TeacherGroups />} />
          <Route path="assessment/:id" element={<SingleAssessment />} />

          {/* Rooms */}
          <Route path="rooms" element={<Rooms />} />
          <Route path="room/:id" element={<RoomsID />} />

          {/* Profile & Other Pages */}
          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />

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
    </ConfigProvider>
  );
}
