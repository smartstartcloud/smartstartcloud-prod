import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom"; 

import Topbar from "./scenes/global/Topbar"
import Sidebar from "./scenes/global/Sidebar"
import Dashboard from "./scenes/dashboard"
import Team from "./scenes/team"
import Invoices from "./scenes/invoices"
import Contacts from "./scenes/contacts"
import Bar from "./scenes/bar"
import Form from "./scenes/form"
import Line from "./scenes/line"
import Pie from "./scenes/pie"
import FAQ from "./scenes/faq"
import Geography from "./scenes/geography"
import Calendar from "./scenes/calendar"
import Login from "./scenes/login";
import { useState } from "react";


function App() {
  const [theme, colorMode] = useMode()
  const [isLoggedIn, setIsloggedIn] = useState(false)

  const initialValue = {
    email: 'admin@admin',
    password: '1234'
  }

  const handleLogin = (value) => {    
    if (initialValue.email === value.email && initialValue.password === value.password){
      setIsloggedIn(true)
    }else {
      setIsloggedIn(false)
    }
    console.log(isLoggedIn);
  }

  const handleLogout = () => {
    setIsloggedIn(false)
    console.log(isLoggedIn);
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isLoggedIn ? <Sidebar /> : undefined}
          <main className="content">
            <Topbar logOut = {handleLogout} />
            <Routes>
              <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to='/login' />} />
              <Route path="/login" element={isLoggedIn ? <Navigate to='/' /> : <Login auth = {handleLogin} />} />
              <Route path="/team" element={isLoggedIn ? <Team /> : <Navigate to='/login' /> } />
              <Route path="/invoices" element={isLoggedIn ? <Invoices /> : <Navigate to='/login' /> } />
              <Route path="/contacts" element={isLoggedIn ? <Contacts /> : <Navigate to='/login' /> } />
              <Route path="/bar" element={isLoggedIn ? <Bar /> : <Navigate to='/login' /> } />
              <Route path="/form" element={isLoggedIn ? <Form /> : <Navigate to='/login' /> } />
              <Route path="/line" element={isLoggedIn ? <Line /> : <Navigate to='/login' /> } />
              <Route path="/pie" element={isLoggedIn ? <Pie /> : <Navigate to='/login' /> } />
              <Route path="/faq" element={isLoggedIn ? <FAQ /> : <Navigate to='/login' /> } />
              <Route path="/geography" element={isLoggedIn ? <Geography /> : <Navigate to='/login' /> } />
              <Route path="/calendar" element={isLoggedIn ? <Calendar /> : <Navigate to='/login' /> } />
              <Route path="/*" element={<Navigate to='/' />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
