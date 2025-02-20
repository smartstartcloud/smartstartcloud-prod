import { Badge, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Tooltip from "@mui/material/Tooltip";

const NotificationCard = ({list}) => {
    const [anchorEl, setAnchorEl] = useState(null);    
    const [filteredList, setFilteredList] = useState([]);  
    const open = Boolean(anchorEl);

    // Use useEffect to update filteredList when `list` changes
    useEffect(() => {
        console.log(list);
        
        setFilteredList(list);  // Update filteredList when `list` is updated
    }, [list]);  // Dependency array ensures this runs whenever `list` changes
    const handleClick = (event) => {
        console.log(filteredList);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleNotification = (id) => {    
        console.log(id);
            
        const index = filteredList.findIndex((listItem) => listItem._id === id);
        if (index !== -1) {
            const newFilteredList = filteredList.splice(index, 1);
            setFilteredList(newFilteredList); // Removes the item at the found index
        }
    };
    return (
      <Box>
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          <Tooltip title="Notifications">
            <Badge badgeContent={list.length} color="info">
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
          {filteredList.length > 0 && filteredList.map((item, index) => (
            <MenuItem
              key={item?._id || `fallback-key-${index}`}
              sx={{ textWrap: "wrap", maxWidth: "400px" }}
              onClick={() =>
                handleNotification(item?._id || `fallback-key-${index}`)
              }
            >
              <PriorityHighIcon color="error" sx={{ marginRight: "15px" }} />{" "}
              {item.message}
              <IconButton>
                <CloseIcon />
              </IconButton>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
}

export default NotificationCard