//topbar component 
import React, { useContext } from 'react'
import { Box, IconButton, Typography, Divider, useTheme } from "@mui/material"
import { ColorModeContext, tokens } from '../../theme'
import InputBase from '@mui/material/InputBase'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import SearchIcon from '@mui/icons-material/Search'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import { useAuthContext } from '../../context/AuthContext'
import DynamicBreadcrumbs from '../../components/DynamicBreadcrumbs'

const Topbar = ({ logOut }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const colorMode = useContext(ColorModeContext)
  const { authUser } = useAuthContext()
  console.log("whats in auth user ? ", authUser)

  return (
      <Box display='flex' flexDirection='column'>
        <Box display="flex" justifyContent="space-between" p={2}>
          <Box display="flex" gap="20px">
            {/* Logo */}
            <Box display="flex" alignItems="center">
              Logo
            </Box>
            {/* Search Bar */}
            <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
              <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
              <IconButton type='button' sx={{ p: 1 }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
          <Box display="flex" gap="10px" alignItems="center">
            {/* User Details */}
            {authUser && (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-end">
                  <Typography variant="overline" color={colors.grey[100]} fontWeight="bold" sx={{ lineHeight: '1.5' }}>
                    {authUser.userName}
                  </Typography>
                  <Typography variant="caption" color={colors.grey[100]}>
                    caption text
                  </Typography>
                </Box>
            )}
            {authUser && <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2 }} />}
            {/* Icons */}
            <Box display="flex" alignItems="center" gap="10px">
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
              </IconButton>
              {authUser && (
                  <>
                    <IconButton>
                      <NotificationsOutlinedIcon />
                    </IconButton>
                    <IconButton>
                      <SettingsOutlinedIcon />
                    </IconButton>
                    {/* User Icon and Name */}
                    <Box display="flex" alignItems="center" gap="8px">
                      <PersonOutlinedIcon />
                      <Typography variant="body1" color={colors.grey[100]} fontWeight="bold">
                        {authUser.userName}
                      </Typography>
                    </Box>
                    {/* Logout Button */}
                    <IconButton onClick={logOut} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ExitToAppOutlinedIcon />
                      <Typography variant="body1" color={colors.grey[100]}>
                        Logout
                      </Typography>
                    </IconButton>
                  </>
              )}
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" px={2}>
          <DynamicBreadcrumbs />
        </Box>
      </Box>
  )
}

export default Topbar
