import React from 'react'
import { useState } from 'react'
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import { Box, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material'
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
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x)[0]  

  const [selected, setSelected] = useState(pathnames ? pathnames : 'task')
  const { authUser, isAdmin } = useAuthContext()

  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [isCollapsed, setIsCollapsed] = useState(isSmallScreen);
  
  return (
    <Box
      sx={{
        position: isSmallScreen ? "fixed" : "sticky",
        top: 0,
        zIndex: isSmallScreen ? 1000 : "auto",
        width: isCollapsed ? "70px" : "250px",
        transition: "width 0.3s ease",
        height: "100vh",
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
      }}
    >
      <ProSidebar collapsed={isCollapsed}
        style={{ height: "100%" }}>
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
          {/* <Typography
            variant="h6"
            color={colors.grey[700]}
            sx={{ p: "10px 10px" }}
            textAlign='center'
          >
            Developed by SOFTCO.IT.COM
          </Typography> */}
        </Box>
      </ProSidebar>
    </Box>
  );
}

export default Sidebar