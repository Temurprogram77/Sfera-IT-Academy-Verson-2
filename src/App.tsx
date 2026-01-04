import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import Home from "./pages/Dashboard/Home";
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

// Role'ga qarab redirect path
const getRoleRedirectPath = (role: string | null): string => {
  const ROLE_REDIRECTS: Record<string, string> = {
    ROLE_SUPER_ADMIN: "/dashboard/super_admin",
    ROLE_ADMIN: "/dashboard/admin",
    ROLE_TEACHER: "/dashboard/teacher",
    ROLE_STUDENT: "/dashboard/student",
    ROLE_PARENT: "/dashboard/parent",
  };
  return role ? (ROLE_REDIRECTS[role] || "/dashboard/teacher") : "/dashboard/teacher";
};

// Protected Route - login bo'lmaganlarni sign in ga yo'naltiradi
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

// Public Route - login bo'lganlarni dashboard ga yo'naltiradi
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("user_role");

  if (token) {
    const redirectPath = getRoleRedirectPath(role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth Routes - login bo'lganlar kira olmaydi */}
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        {/* Protected Dashboard Routes - faqat login bo'lganlar kira oladi */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="dashboard/admin" element={<Admin />} />
          <Route path="dashboard/super_admin" element={<SuperAdmin />} />
          <Route path="dashboard/teacher" element={<Teacher />} />
          <Route path="dashboard/student" element={<Student />} />
          <Route path="dashboard/parent" element={<Parent />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
          <Route path="parents" element={<Parents />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="groups" element={<Groups />} />
          <Route path="rooms" element={<Rooms />} />

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
    </Router>
  );
}