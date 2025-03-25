import { Badge, Box, Divider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const SettingsCard = () => {
    const [anchorEl, setAnchorEl] = useState(null);    
    const open = Boolean(anchorEl);
    const  { authUser } = useAuthContext()

    const navigate = useNavigate();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
      <Box>
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          <Tooltip title="Notifications">
            <Badge color="info">
              <IconButton onClick={handleClick} size="small" sx={{ ml: 0 }}>
                <SettingsOutlinedIcon sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Badge>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                overflow: "auto", // Enable scrolling if content overflows
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            sx={{ textWrap: "wrap", maxWidth: "400px" }}
            onClick={() => {navigate(`/editProfile`, { state: { uID: authUser._id }}); handleClose();}}
          >
            Edit Profile
          </MenuItem>
        </Menu>
      </Box>
    );
}

export default SettingsCard