import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, Suspense, lazy } from "react";
import { Spin } from "antd";
import { Toaster } from "sonner";
import { ConfigProvider, theme as antdTheme } from "antd";

import { useTheme } from "./context/ThemeContext";
import { useAuthContext } from "./context/AuthContext";
import { ScrollToTop } from "./components/common/ScrollToTop";
import "./i18n";

// Kichik, darhol kerak bo'ladigan sahifalar — lazy EMAS
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";

// ─── Lazy imports ─────────────────────────────────────────────────────────────

// Dashboards
const Admin = lazy(() => import("./dashboards/admin"));
const SuperAdmin = lazy(() => import("./dashboards/super_admin"));
const Teacher = lazy(() => import("./dashboards/teacher"));
const Student = lazy(() => import("./dashboards/student"));
const Parent = lazy(() => import("./dashboards/parent"));

// Users
const Teachers = lazy(() => import("./pages/Teachers/Teachers"));
const TeachersDetail = lazy(() => import("./pages/TeachersDetail/TeachersDetail"));
const Admins = lazy(() => import("./pages/Admins/Admins"));
const InActives = lazy(() => import("./pages/InActives/InActives"));
const AdminsDetail = lazy(() => import("./pages/AdminsDetail/AdminsDetail"));
const Students = lazy(() => import("./pages/Students/Students"));
const StudentsDetail = lazy(() => import("./pages/StudentsDetail/StudentsDetail"));
const Parents = lazy(() => import("./pages/Parents/Parents"));
const ParentsDetail = lazy(() => import("./pages/ParentsDetail/ParentsDetail"));
const MyChildsGrades = lazy(() => import("./pages/MyChildsGrades/MyChildsGrades"));
const MyChildsDetail = lazy(() => import("./pages/MyChildsDetail/MyChildsDetail"));

// Grades
const Grades = lazy(() => import("./pages/Grades/Grades"));
const MyGrades = lazy(() => import("./pages/myGrades/MyGrades"));
const TeacherGroups = lazy(() => import("./pages/Grades/Assessment"));
const GroupAssessmentPage = lazy(() => import("./pages/Grades/GroupAssessmentPage"));

// Attendance
const Attendance = lazy(() => import("./pages/Attendance/Attendance"));
const AttendanceGroup = lazy(() => import("./pages/Attendance/AttendanceGroup"));
const Presence = lazy(() => import("./pages/Attendance/Presence"));
const PresenceGroup = lazy(() => import("./pages/Attendance/PresenceGroup"));

// Categories & Groups
const Categories = lazy(() => import("./pages/Categories/Categories"));
const CategoryDetail = lazy(() => import("./pages/CategoryDetail/CategoryDetail"));
const Groups = lazy(() => import("./pages/Groups/Groups"));
const GroupsDetail = lazy(() => import("./pages/groupsDetail/groupsDetail"));

// Rooms
const Rooms = lazy(() => import("./pages/Rooms/Rooms"));
const RoomsID = lazy(() => import("./pages/RoomsID/RoomsID"));

// Others
const Messages = lazy(() => import("./pages/Messages/Messages"));
const News = lazy(() => import("./pages/News/News"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const Calendar = lazy(() => import("./pages/Calendar"));

// ─── Loading fallback ─────────────────────────────────────────────────────────

const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <Spin size="large" />
  </div>
);

// ─── Role config ──────────────────────────────────────────────────────────────

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ROLE_REDIRECTS: Record<string, string> = {
  ROLE_SUPER_ADMIN: "/dashboard/super_admin",
  ROLE_ADMIN: "/dashboard/admin",
  ROLE_TEACHER: "/dashboard/teacher",
  ROLE_STUDENT: "/dashboard/student",
  ROLE_PARENT: "/dashboard/parent",
};

const getRoleRedirectPath = (role: string | null) =>
  role ? ROLE_REDIRECTS[role] || "/dashboard/teacher" : "/signin";

const RootRedirect: React.FC = () => {
  const { role } = useAuthContext();
  return <Navigate to={getRoleRedirectPath(role)} replace />;
};

function ProtectedRoute({ children, allowedRoles }: Props) {
  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("user_role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    if (role === "ROLE_ADMIN") return <Navigate to="/dashboard/admin" replace />;
    if (role === "ROLE_TEACHER") return <Navigate to="/dashboard/teacher" replace />;
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: Props) {
  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("user_role");

  if (token && role && ROLE_REDIRECTS[role]) {
    return <Navigate to={ROLE_REDIRECTS[role]} replace />;
  }

  return <>{children}</>;
}

// ─── App ──────────────────────────────────────────────────────────────────────

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
            background: "red", color: "white", padding: "10px",
            textAlign: "center", position: "fixed",
            top: 0, left: 0, width: "100%", zIndex: 9999,
          }}
        >
          Internet yo'q. Iltimos, tarmoqni tekshiring.
        </div>
      )}

      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
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

          {/* Protected layout */}
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
            <Route path="dashboard/admin" element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><Admin /></ProtectedRoute>} />
            <Route path="dashboard/super_admin" element={<ProtectedRoute allowedRoles={["ROLE_SUPER_ADMIN"]}><SuperAdmin /></ProtectedRoute>} />
            <Route path="dashboard/teacher" element={<ProtectedRoute allowedRoles={["ROLE_TEACHER"]}><Teacher /></ProtectedRoute>} />
            <Route path="dashboard/student" element={<ProtectedRoute allowedRoles={["ROLE_STUDENT"]}><Student /></ProtectedRoute>} />
            <Route path="dashboard/parent" element={<ProtectedRoute allowedRoles={["ROLE_PARENT"]}><Parent /></ProtectedRoute>} />

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
            <Route path="inactives" element={<InActives />} />

            {/* Grades */}
            <Route path="grades" element={<Grades />} />
            <Route path="my-grades" element={<MyGrades />} />
            <Route path="assessment" element={<TeacherGroups />} />
            <Route path="assessment/:id" element={<GroupAssessmentPage />} />

            {/* Attendance */}
            <Route path="attendance/:id" element={<Attendance />} />
            <Route path="attendance" element={<AttendanceGroup />} />
            <Route path="presence/:id" element={<Presence />} />
            <Route path="presence" element={<PresenceGroup />} />

            {/* Categories & Groups */}
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:id" element={<CategoryDetail />} />
            <Route path="groups" element={<Groups />} />
            <Route path="groups/:id" element={<GroupsDetail />} />

            {/* Rooms */}
            <Route path="rooms" element={<Rooms />} />
            <Route path="room/:id" element={<RoomsID />} />

            {/* Others */}
            <Route path="messages" element={<Messages />} />
            <Route path="news" element={<News />} />
            <Route path="profile" element={<UserProfiles />} />
            <Route path="calendar" element={<Calendar />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster
        position="top-right"
        richColors
        theme={theme === "dark" ? "dark" : "light"}
      />
    </ConfigProvider>
  );
}
