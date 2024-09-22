import React, { useContext } from 'react'
import { Box, IconButton, Typography, Divider, useTheme } from "@mui/material"
import { ColorModeContext, tokens } from '../../theme'
import InputBase from '@mui/material/InputBase'
import  LightModeOutlinedIcon  from '@mui/icons-material/LightModeOutlined'
import  DarkModeOutlinedIcon  from '@mui/icons-material/DarkModeOutlined'
import  NotificationsOutlinedIcon  from '@mui/icons-material/NotificationsOutlined'
import  SettingsOutlinedIcon  from '@mui/icons-material/SettingsOutlined'
import  PersonOutlinedIcon  from '@mui/icons-material/PersonOutlined'
import  SearchIcon  from '@mui/icons-material/Search'
import { useAuthContext } from '../../context/AuthContext'
import DynamicBreadcrumbs from '../../components/DynamicBreadcrumbs'


const Topbar = ({logOut}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const colorMode = useContext(ColorModeContext)
  const {authUser} = useAuthContext()
  
  return (
    <Box
      display='flex'
      flexDirection='column'
    >
      <Box 
        display="flex" 
        justifyContent="space-between" 
        p={2}
      >
        <Box
          display="flex"
          gap="20px"
        >
          {/* Logo */}
          <Box 
            display="flex"
            alignItems="center"
          >
              Logo
          </Box>
          {/* Search Bar */}
          <Box 
            display="flex" 
            backgroundColor={colors.primary[400]} 
            borderRadius="3px" >
              <InputBase sx={{ml:2, flex: 1 }} placeholder="Search" />
              <IconButton type='button' sx={{p: 1}}>
                <SearchIcon />
              </IconButton>
          </Box>
        </Box>
        <Box
          display="flex"
          gap="10px"
        >
          {/* User Details */}
          {authUser ? <Box 
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography variant="overline" textAlign="right" color={colors.grey[100]} fontWeight="bold" sx={{ display: 'block', lineHeight: '1.5'}}>
              {authUser.userName}
            </Typography>
            <Typography variant="caption" textAlign="right" color={colors.grey[100]} sx={{ display: 'block' }}>
              caption text
            </Typography>
          </Box> : undefined}
          {/* Vertical Separator */}
          {authUser? <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2 }} /> : undefined}
          {/* Icons */}
          <Box display="flex">
            <IconButton onClick={colorMode.toggleColorMode}>
              { theme.palette.mode === "dark" ? (<DarkModeOutlinedIcon />) : (<LightModeOutlinedIcon />) }
            </IconButton>
            {authUser ? <IconButton>
              <NotificationsOutlinedIcon />
            </IconButton> : undefined}
            {authUser ? <IconButton>
              < SettingsOutlinedIcon/>
            </IconButton> : undefined}
            {authUser ? <IconButton onClick={logOut}>
              <PersonOutlinedIcon />
            </IconButton> : undefined}
          </Box>
        </Box>
      </Box>
      <Box
        display="flex" 
        justifyContent="space-between" 
        px={2}
      >
        <DynamicBreadcrumbs />
      </Box>

    </Box>

  )
}

export default Topbar