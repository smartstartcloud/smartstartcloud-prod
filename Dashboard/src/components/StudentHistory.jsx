import { Box, Card, CardContent, CircularProgress, colors, Container, IconButton, Modal, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { tokens } from '../theme';
import CloseIcon from "@mui/icons-material/Close";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import useFetchStudentAllLogs from '../hooks/useFetchStudentAllLogs';
import { format } from 'date-fns';
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AddIcon from "@mui/icons-material/Add";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import RemoveIcon from "@mui/icons-material/Remove";

const customScrollbarStyles = {
  "&::-webkit-scrollbar": {
    display: "none",
  },
  msOverflowStyle: "none", // ✅ IE/Edge -ms-overflow-style
  scrollbarWidth: "none", // ✅ Firefox
};

const StudentHistory = ({
    open,
    setOpen,
    studentId
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);  
    const { logs: logData, loading, error } = useFetchStudentAllLogs(studentId); 
    const [studentIDLog, setStudentIDLog] = useState(null);
    const [logs, setLogs] = useState([]);

    const actionTypeTheme = {
      newStudentDynamic: { icon: <AddIcon />, color: "add" },
      updateStudentDynamic: { icon: <UpgradeIcon />, color: "update" },
      newStudentManual: { icon: <AddIcon />, color: "add" },
      updateStudentManual: { icon: <UpgradeIcon />, color: "update" },
      newAssignmentDynamic: { icon: <AddIcon />, color: "add" },
      newAssignmentManual: { icon: <AddIcon />, color: "add" },
      updateAssignmentDynamic: { icon: <UpgradeIcon />, color: "update" },
      updateAssignmentManual: { icon: <UpgradeIcon />, color: "update" },
      deleteAssignment: { icon: <RemoveIcon />, color: "delete" },
    };

    useEffect(() => {
      if (logData) {
        const { studentID, logs } = logData;
        setStudentIDLog(studentID);
        setLogs(logs);
      }
      console.log(logs);
      
    }, [logData]);

    
    if (loading) {
      return (
        <Box
          mt="200px"
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <CircularProgress size={150} sx={{ color: colors.blueAccent[100] }} />
        </Box>
      );
    }
  
    if (error) {
      return <div>{error.message}</div>;
    }
    
    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <Container maxWidth="lg" sx={{ marginTop: "50px" }}>
          <Card
            raised
            sx={{
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              position: "relative",
              backgroundColor: theme.palette.background.paper,
              ...customScrollbarStyles,
            }}
          >
            <IconButton
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 10,
                color: theme.palette.grey[700],
                backgroundColor: theme.palette.background.default,
                borderRadius: "50%",
                padding: "10px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>

            <CardContent>
              <Typography variant="h3" component="span">
                History of {studentIDLog}
              </Typography>
              <Timeline
                sx={{
                  [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                  },
                }}
              >
                {logs && logs.length > 0 ? (
                  logs.map((log, index) => (
                    <TimelineItem key={log._id}>
                      <TimelineOppositeContent
                        sx={{
                          m: "auto 0",
                        }}
                        align="right"
                        variant="body2"
                        color={colors.blueAccent[400]}
                      >
                        {format(log.timestamp, "hh:mm:ss dd/MM/yyyy ")}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot variant="outlined">
                          {actionTypeTheme[log.action]?.icon || (
                            <FastfoodIcon />
                          )}
                        </TimelineDot>
                        <TimelineConnector />
                        {/* {index !== logs.length - 1 ? <TimelineConnector /> : ""} */}
                      </TimelineSeparator>
                      <TimelineContent
                        sx={{
                          py: "12px",
                          px: 2,
                        }}
                      >
                        <Typography variant="h6" component="span">
                          {log.message}
                        </Typography>
                        <Typography>Because you need strength</Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))
                ) : (
                  <Typography
                    variant="h3"
                    color={colors.grey[100]}
                    sx={{ fontWeight: "bold", mb: 2 }}
                  >
                    No logs for this Student.
                  </Typography>
                )}
              </Timeline>
            </CardContent>
          </Card>
        </Container>
      </Modal>
    );
}

export default StudentHistory