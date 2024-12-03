import React, { useEffect } from 'react'
import { useState } from 'react'
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { tokens } from '../../theme'
import "react-pro-sidebar/dist/css/styles.css";
import { useAuthContext } from '../../context/AuthContext'
import  HomeOutlinedIcon  from '@mui/icons-material/HomeOutlined'
import  PersonOutlinedIcon  from '@mui/icons-material/PersonOutlined'
import  HelpOutlinedIcon  from '@mui/icons-material/HelpOutlined'
import  MenuOutlinedIcon  from '@mui/icons-material/MenuOutlined'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import ListIcon from "@mui/icons-material/List";

const Item = ({title, to, icon, selected, setSelected}) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)  
  

  return (
    <MenuItem 
      active={selected === to.split('/')[1]} 
      style={{ color: colors.grey[100]}} 
      onClick={() => setSelected(to.split('/')[1]) }
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  )
}


const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x)[0];

  const [selected, setSelected] = useState(pathnames ? pathnames : "task");
  const { authUser, isAdmin, isCollapsed, setIsCollapsed } = useAuthContext();

  // Use `useMediaQuery` to detect screen size
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Automatically collapse the sidebar for mobile
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);
  
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        position: "fixed",
        top: 0,
        height: "100vh", // Ensures the sidebar spans the full viewport height
        zIndex: 10, // Keeps it above other elements if needed
      }}
    >
      <ProSidebar
        collapsed={isCollapsed}
        collapsedWidth="70px"
        width={isMobile ? "100vw" : ""}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
        >
          <Menu iconShape="square">
            {/* Logo and Icon Menu */}
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <IconButton
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{ marginLeft: "auto" }}
                  >
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {/* User */}
            {!isCollapsed && (
              <Box mb="25px">
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {authUser.name}
                  </Typography>
                  <Typography variant="h4" color={colors.greenAccent[500]}>
                    {authUser?.role
                      ? authUser.role.charAt(0).toUpperCase() +
                        authUser.role.slice(1)
                      : ""}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Menu Items */}
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/task"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Add Degree"
                to="/add-degree"
                icon={<CollectionsBookmarkOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="All Degrees"
                to="/allDegrees"
                icon={<StorageOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="All Orders"
                to="/allOrders"
                icon={<ListIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {isAdmin && (
                <Item
                  title="Signup User"
                  to="/signup"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              )}
              <Item
                title="FAQ Page"
                to="/faq"
                icon={<HelpOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Menu>
          <Typography
            color={colors.grey[700]}
            sx={{ p: "10px 0px", fontSize: "10px" }}
            textAlign="center"
          >
            Developed by SOFTCO.IT.COM
          </Typography>
        </Box>
      </ProSidebar>
    </Box>
  );
}

export default Sidebar