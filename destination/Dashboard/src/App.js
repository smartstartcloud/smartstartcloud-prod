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
import DegreeProfile from "./components/profilePages/degreeProfile";
import SignupForm from "./components/forms/SignupForm";
import LoginForm from "./components/forms/LoginForm";
import useLogout from "./hooks/useLogout";
import UploadDownload from "./devTest/uploadDownload";
import StudentProfile from "./components/profilePages/StudentProfile";
import AllDegree from "./scenes/dashboard/AllDegree";
import GlobalUploadPage from "./devTest/GlobalUploadPage";
import ModuleProfile from "./components/profilePages/ModuleProfile";
import PortalIndex from "./components/Portal/PortalIndex";
import PortalAll from "./components/Portal/PortalAll";
import PortalSidebar from "./components/Portal/PortalSidebar";
import OrderIDList from "./components/profilePages/OrderIDList";
import StudentList from "./scenes/studentList";
import PaymentApproval from "./components/profilePages/PaymentApproval";

export const App = () => {
  const [theme, colorMode] = useMode();
  const { authUser, isAdmin, isFinance, isPortal, isCollapsed } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();

  const handleLogout = () => {
    logout().then(() => console.log("User logged out successfully"));
  };  

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {authUser && location.pathname !== '/welcome' && <Sidebar />}
          <main className="content" style={{marginLeft: !authUser || location.pathname === '/welcome' ? '0px' : isCollapsed ? '100px' : '300px', transition: "margin-left 0.3s ease"}}>
            {location.pathname !== '/welcome' && <Topbar logOut={handleLogout} />}
            <Routes>
              {/* Main app routes */}
              <Route path="/login" element={authUser && !isPortal ? <Navigate to='/task' /> : <LoginForm />} />
              <Route path="/task" element={authUser && !isPortal ? <Dashboard /> : <Navigate to='/login' />} />
              <Route path="/allDegrees" element={authUser && !isPortal ? <AllDegree /> : <Navigate to='/login' />} />
              <Route path="/allOrders" element={authUser && !isPortal ? <OrderIDList /> : <Navigate to='/login' />} />
              <Route path="/welcome" element={authUser && !isPortal ? <Welcome /> : <Navigate to='/login' />} />
              <Route path="/renew" element={authUser && !isPortal ? <Navigate to='/' /> : <RenewPassword />} />
              <Route path="/signup" element={isAdmin ? <SignupForm /> : <Navigate to='/' />} />
              <Route path="/add-degree" element={authUser && !isPortal ? <DegreeForm /> : <Navigate to='/login' />} />
              <Route path="/allStudent" element={authUser && !isPortal ? <StudentList /> : <Navigate to='/login' />} />
              <Route path="/faq" element={authUser && !isPortal ? <FAQ /> : <Navigate to='/login' />} />
              <Route path="/task/:degreeYear" element={authUser && !isPortal ? <DegreeBoard /> : <Navigate to='/login' />} />
              <Route path="/task/:degreeYear/:degreeId" element={authUser && !isPortal ? <DegreeProfile /> : <Navigate to='/login' />} />
              <Route path="/task/:degreeYear/:degreeId/editDegree" element={authUser && !isPortal ? <DegreeForm editPage={true} /> : <Navigate to='/login' />} />
              <Route path="/task/:degreeYear/:degreeId/student/:studentId" element={authUser && !isPortal ? <StudentProfile /> : <Navigate to='/login' />} />
              <Route path="/task/:degreeYear/:degreeId/module/:moduleCode" element={authUser && !isPortal ? <ModuleProfile /> : <Navigate to='/login' />} />

              <Route path="/paymentApprovals" element={isFinance ? <PaymentApproval /> : <Navigate to='/' />} />

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