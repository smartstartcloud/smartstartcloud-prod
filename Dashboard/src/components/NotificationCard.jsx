import { Badge, Box, Divider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from 'react-router-dom';
import useSendMarkNotificationAsRead from '../hooks/useSendMarkNotificationAsRead';
import { useAuthContext } from '../context/AuthContext';

const NotificationCard = ({list = []}) => {
    const [anchorEl, setAnchorEl] = useState(null);    
    const open = Boolean(anchorEl);
    const [newList, setNewList] = useState(list);
    const {authUser} = useAuthContext()    

    const { sendMarkNotificationAsRead } = useSendMarkNotificationAsRead();


    const navigate = useNavigate();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
      if (list.length > 0){
        setNewList(list);
      }
    }, [list]); // This will re-run the effect whenever `list` changes

    const handleNotificationClick = (id) => {
        const notification = list.find((item) => item._id === id);
        if (notification) {
          const {goTo, dataId} = notification.metadata;
          navigate(goTo, { state: { dataId } });
          handleDismiss(id)
          sendMarkNotificationAsRead(id, authUser._id)

        } else {
          console.error(`Notification with ID ${id} not found`);
        }
        
    };

    const handleDismiss = (id) => {
      setNewList((prev) => prev.filter((item) => item._id !== id));
    };
    return (
      <Box>
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          <Tooltip title="Notifications">
            <Badge badgeContent={newList.length} color="info">
              <IconButton onClick={handleClick} size="small" sx={{ ml: 0 }}>
                <NotificationsOutlinedIcon sx={{ width: 20, height: 20 }} />
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
          {newList.length > 0 &&
            newList.map((item, index) => (
              <MenuItem
                key={item?._id || `fallback-key-${index}`}
                sx={{ textWrap: "wrap", maxWidth: "400px" }}
                onClick={() => handleNotificationClick(item._id)}
              >
                <PriorityHighIcon color="error" sx={{ marginRight: "15px" }} />{" "}
                {item.message}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss(item._id);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </MenuItem>
            ))}
        </Menu>
      </Box>
    );
}

export default NotificationCard