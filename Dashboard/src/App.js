import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import FAQ from "./scenes/faq";
import { useAuthContext } from "./context/AuthContext";
import RenewPassword from "./scenes/renewPassword";
import Welcome from "./scenes/welcome";
import DegreeForm from "./components/forms/DegreeForm";
import DegreeBoard from "./scenes/degree";
import DegreeProfile from "./scenes/degree/degreeProfile";
import SignupForm from "./components/forms/SignupForm";
import LoginForm from "./components/forms/LoginForm";
import useLogout from "./hooks/useLogout";
import UploadDownload from "./devTest/uploadDownload";
import StudentProfile from "./components/profilePages/StudentProfile";
import AllDegree from "./scenes/dashboard/AllDegree";
import GlobalUploadPage from "./devTest/GlobalUploadPage";
import ModuleProfile from "./components/profilePages/ModuleProfile";
import { useEffect } from "react";
import PortalIndex from "./components/Portal/PortalIndex";
import PortalAll from "./components/Portal/PortalAll";
import PortalSidebar from "./components/Portal/PortalSidebar";

export const App = () => {
  const [theme, colorMode] = useMode();
  const { authUser, isAdmin } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const hostname = window.location.hostname;
    
  //   // Check for 'portal' subdomain and ensure navigation to portal routes
  //   if (hostname === "portal.smartstart.cloud" || hostname === "portal.localhost") {
  //     if (!location.pathname.startsWith("/portal")) {
  //       navigate("/portal");
  //     }
  //   }
  // }, [location.pathname, navigate]);

  const handleLogout = () => {
    logout().then(() => console.log("User logged out successfully"));
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {authUser && location.pathname !== '/welcome' && <Sidebar />}
          <main className="content">
            {location.pathname !== '/welcome' && <Topbar logOut={handleLogout} />}
            <Routes>
              {/* Main app routes */}
              <Route path="/task" element={authUser ? <Dashboard /> : <Navigate to='/login' />} />
              <Route path="/allDegrees" element={authUser ? <AllDegree /> : <Navigate to='/login' />} />
              <Route path="/uploadPage" element={<UploadDownload />} />
              <Route path="/globalLink" element={<GlobalUploadPage />} />
              <Route path="/welcome" element={authUser ? <Welcome /> : <Navigate to='/login' />} />
              <Route path="/renew" element={authUser ? <Navigate to='/' /> : <RenewPassword />} />
              <Route path="/signup" element={isAdmin ? <SignupForm /> : <Navigate to='/' />} />
              <Route path="/login" element={authUser ? <Navigate to='/' /> : <LoginForm />} />
              <Route path="/add-degree" element={authUser ? <DegreeForm /> : <Navigate to='/login' />} />
              <Route path="/faq" element={authUser ? <FAQ /> : <Navigate to='/' />} />
              <Route path="/task/:degreeYear" element={authUser ? <DegreeBoard /> : <Navigate to='/login' />} />
              <Route path="/task/:degreeYear/:degreeId" element={authUser ? <DegreeProfile /> : <Navigate to='/login' />} />
              <Route path="/task/:degreeYear/:degreeId/student/:studentId" element={authUser ? <StudentProfile /> : <Navigate to='/login' />} />
              <Route path="/task/:degreeYear/:degreeId/module/:moduleCode" element={authUser ? <ModuleProfile /> : <Navigate to='/login' />} />

              {/* Catch-all route */}
              <Route path="/*" element={<Navigate to='/task' />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const AppPortal = () => {
  const [theme, colorMode] = useMode();
  const { authUser, isAdmin } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout().then(() => console.log("User logged out successfully"));
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {authUser && <PortalSidebar />}
          <main className="content">
            {location.pathname !== "/welcome" && (
              <Topbar logOut={handleLogout} />
            )}
            <Routes>
              {/* Portal-specific routes */}
              <Route path="/" element={authUser ? <PortalIndex /> : <Navigate to="/login" />}/>
              <Route path="/all" element={authUser ? <PortalAll /> : <Navigate to="/login" />}/>

              {/* Main app routes */}
              <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginForm />}/>

              {/* Catch-all route */}
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}