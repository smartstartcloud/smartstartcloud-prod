import React, { useContext, useEffect, useState } from 'react'
import { Box, IconButton, Typography, Divider, useTheme, useMediaQuery, Button, Menu, MenuItem, Badge } from "@mui/material"
import { ColorModeContext, tokens } from '../../theme'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import { useAuthContext } from '../../context/AuthContext'
import DynamicBreadcrumbs from '../../components/DynamicBreadcrumbs'
import Logo from '../global/SmartstartLogo-removebg-preview.png'
import MenuIcon from "@mui/icons-material/Menu";
import NotificationCard from '../../components/NotificationCard'
import useFetchAllNotifications from '../../hooks/useFetchAllNotifications'

const Topbar = ({ logOut }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { authUser } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const { notificationList, loading, error} = useFetchAllNotifications(authUser?._id);

  useEffect(() => {
    if (notificationList) {
      setNotifications(notificationList);
    }
  }, [notificationList]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {    
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Use `useMediaQuery` to detect screen size
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Automatically collapse the sidebar for mobile
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between" p={2}>
        <Box display="flex" alignItems="center" gap="20px">
          <Box
            display="flex"
            alignItems="center"
            sx={{ width: { xs: "135px" } }}
          >
            <img
              src={Logo}
              alt="SmartStart Logo"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
        </Box>
        <Box display="flex" gap="10px" alignItems="center">
          {authUser && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-end"
            >
              <Typography
                variant="overline"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ lineHeight: "1.5" }}
              >
                {authUser.name}
              </Typography>
              <Typography variant="caption" color={colors.grey[100]}>
                {authUser.role}
              </Typography>
            </Box>
          )}
          {authUser && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderRightWidth: 2 }}
            />
          )}
          {isMobile ? (
            <div>
              <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                      <DarkModeOutlinedIcon />
                    ) : (
                      <LightModeOutlinedIcon />
                    )}
                  </IconButton>
                  {authUser && [
                    <IconButton>
                      <SettingsOutlinedIcon />
                    </IconButton>,
                    <NotificationCard list={notifications} />,
                  ]}
                </MenuItem>
                <MenuItem sx={{ display: "flex", justifyContent: "center" }}>
                  {authUser && (
                    <Box display="flex" justifyContent="center" gap="8px">
                      <PersonOutlinedIcon />
                      <Typography
                        variant="body1"
                        color={colors.grey[100]}
                        fontWeight="bold"
                      >
                        {authUser.userName}
                      </Typography>
                    </Box>
                  )}
                </MenuItem>
                <MenuItem>
                  {authUser && (
                    <IconButton
                      onClick={logOut}
                      sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <ExitToAppOutlinedIcon />
                      <Typography variant="body1" color={colors.grey[100]}>
                        Logout
                      </Typography>
                    </IconButton>
                  )}
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Box display="flex" alignItems="center" gap="10px">
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )}
              </IconButton>
              {authUser && (
                <>
                  <NotificationCard list={notifications} />
                  <Box display="flex" alignItems="center" gap="8px">
                    <PersonOutlinedIcon />
                    <Typography
                      variant="body1"
                      color={colors.grey[100]}
                      fontWeight="bold"
                    >
                      {authUser.userName}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={logOut}
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <ExitToAppOutlinedIcon />
                    <Typography variant="body1" color={colors.grey[100]}>
                      Logout
                    </Typography>
                  </IconButton>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {authUser && (
        <Box display="flex" justifyContent="space-between" px={2}>
          <DynamicBreadcrumbs />
        </Box>
      )}
    </Box>
  );
}

export default Topbar
