import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import useLogout from "./hooks/useLogout";

// Layout Components
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import PortalSidebar from "./components/Portal/PortalSidebar";

// Auth Pages
import LoginForm from "./components/forms/LoginForm";
import SignupForm from "./components/forms/SignupForm";
import RenewPassword from "./scenes/renewPassword";
import ForgotPasswordPage from "./components/forms/ForgotPasswordPage";
import ResetPasswordPage from "./components/forms/ResetPasswordPage";


// Dashboard & Task Views
import Dashboard from "./scenes/dashboard";
import GlobalSearch from "./scenes/globalSearch/GlobalSearch";
import AllDegree from "./scenes/dashboard/AllDegree";
import DegreeBoard from "./scenes/degree";
import DegreeProfile from "./components/profilePages/degreeProfile";
import DegreeForm from "./components/forms/DegreeForm";
import StudentProfile from "./components/profilePages/StudentProfile";
import ModuleProfile from "./components/profilePages/ModuleProfile";
import OrderIDList from "./components/profilePages/OrderIDList";
import StudentList from "./scenes/studentList";
import AgentList from "./scenes/agentList/AgentList";
import PaymentApproval from "./components/profilePages/PaymentApproval";
import LogList from "./scenes/logList/LogList";
import FAQ from "./scenes/faq";
import Welcome from "./scenes/welcome";
import UserProfilePage from "./components/profilePages/UserProfilePage";

// Portal
import PortalIndex from "./components/Portal/PortalIndex";
import PortalAll from "./components/Portal/PortalAll";

const publicRoutes = [
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },
];

export const App = () => {
  const [theme, colorMode] = useMode();
  const { authUser, isAdmin, isFinance, isPortal, isCollapsed } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();

  const handleLogout = () => logout().then(() => console.log("User logged out successfully"));

  const protectedRoutes = [
    { path: "/task", element: <Dashboard /> },
    { path: "/globalSearch", element: <GlobalSearch /> },
    { path: "/allDegrees", element: <AllDegree /> },
    { path: "/allOrders", element: <OrderIDList /> },
    { path: "/add-degree", element: <DegreeForm /> },
    { path: "/allStudent", element: <StudentList /> },
    { path: "/faq", element: <FAQ /> },
    { path: "/task/:degreeYear", element: <DegreeBoard /> },
    { path: "/task/:degreeYear/:degreeId", element: <DegreeProfile /> },
    { path: "/task/:degreeYear/:degreeId/editDegree", element: <DegreeForm editPage={true} /> },
    { path: "/task/:degreeYear/:degreeId/student/:studentId", element: <StudentProfile /> },
    { path: "/task/:degreeYear/:degreeId/module/:moduleCode", element: <ModuleProfile /> },
    { path: "/editProfile", element: <UserProfilePage /> },
    { path: "/welcome", element: <Welcome /> },
    { path: "/paymentApprovals", element: isFinance ? <PaymentApproval /> : <Navigate to='/' /> },
    { path: "/allLogs", element: isAdmin ? <LogList /> : <Navigate to='/' /> },
    { path: "/allAgent", element: isAdmin ? <AgentList /> : <Navigate to='/' /> },
  ];

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {authUser && location.pathname !== "/welcome" && <Sidebar />}
          <main
            className="content"
            style={{
              marginLeft:
                !authUser || location.pathname === "/welcome"
                  ? "0px"
                  : isCollapsed
                  ? "100px"
                  : "300px",
              transition: "margin-left 0.3s ease",
            }}
          >
            {location.pathname !== "/welcome" && <Topbar logOut={handleLogout} />}
            <Routes>
              <Route path="/login" element={authUser && !isPortal ? <Navigate to='/task' /> : <LoginForm />} />
              <Route path="/renew" element={authUser && !isPortal ? <Navigate to='/' /> : <RenewPassword />} />
              <Route path="/signup" element={isAdmin ? <SignupForm /> : <Navigate to='/' />} />

              {publicRoutes.map((route, idx) => (
                <Route key={idx} path={route.path} element={route.element} />
              ))}

              {protectedRoutes.map((route, idx) => (
                <Route
                  key={idx}
                  path={route.path}
                  element={authUser && !isPortal ? route.element : <Navigate to='/login' />}
                />
              ))}

              <Route path="/*" element={<Navigate to='/task' />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const AppPortal = () => {
  const [theme, colorMode] = useMode();
  const { authUser, isAdmin } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => logout().then(() => console.log("User logged out successfully"));

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {authUser && <PortalSidebar />}
          <main className="content">
            {location.pathname !== "/welcome" && <Topbar logOut={handleLogout} />}
            <Routes>
              <Route path="/" element={authUser ? <PortalIndex /> : <Navigate to="/login" />} />
              <Route path="/editProfile" element={authUser ? <UserProfilePage /> : <Navigate to='/' />} />
              <Route path="/all" element={authUser ? <PortalAll /> : <Navigate to="/login" />} />
              <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginForm />} />

              {publicRoutes.map((route, idx) => (
                <Route key={idx} path={route.path} element={route.element} />
              ))}

              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
