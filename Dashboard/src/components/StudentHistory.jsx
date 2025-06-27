import { Box, Button, Card, CardContent, CircularProgress, colors, Container, IconButton, Modal, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
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
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { isAfter, isBefore, isSameDay } from "date-fns";

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
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [dateFilter, setDateFilter] = useState({ from: null, to: null });
    const [typeFilter, setTypeFilter] = useState("all");
    console.log(logData);
    

    const actionTypeTheme = {
      newStudentDynamic: {
        icon: <AddIcon />,
        color: "add",
        type: "Student",
        typeData: "studentID",
      },
      updateStudentDynamic: {
        icon: <UpgradeIcon />,
        color: "update",
        type: "Student",
        typeData: "studentID",
      },
      newStudentManual: {
        icon: <AddIcon />,
        color: "add",
        type: "Student",
        typeData: "studentID",
      },
      updateStudentManual: {
        icon: <UpgradeIcon />,
        color: "update",
        type: "Student",
        typeData: "studentID",
      },
      newAssignmentDynamic: {
        icon: <AddIcon />,
        color: "add",
        type: "Assignment",
        typeData: "assignmentName",
      },
      newAssignmentManual: {
        icon: <AddIcon />,
        color: "add",
        type: "Assignment",
        typeData: "assignmentName",
      },
      updateAssignmentDynamic: {
        icon: <UpgradeIcon />,
        color: "update",
        type: "Assignment",
        typeData: "assignmentName",
      },
      updateAssignmentManual: {
        icon: <UpgradeIcon />,
        color: "update",
        type: "Assignment",
        typeData: "assignmentName",
      },
      deleteAssignment: {
        icon: <RemoveIcon />,
        color: "delete",
        type: "Assignment",
        typeData: "assignmentName",
      },
      newPayment: {
        icon: <CurrencyPoundIcon />,
        color: "add",
        type: "Payment",
        typeData: "financeID",
      },
      updatePayment: {
        icon: <UpgradeIcon />,
        color: "update",
        type: "Payment",
        typeData: "financeID",
      },
      deletePayment: {
        icon: <RemoveIcon />,
        color: "delete",
        type: "Payment",
        typeData: "financeID",
      },
      fileUpload: {
        icon: <UploadFileIcon />,
        color: "add",
        type: "File",
        typeData: "fileName",
      },
      fileDownload: {
        icon: <DownloadIcon />,
        color: "info",
        type: "File",
        typeData: "fileName",
      },
      fileDelete: {
        icon: <RemoveIcon />,
        color: "delete",
        type: "File",
        typeData: "fileName",
      },
    };
    

    const handleResetFilterDate = () => {
      setDateFilter({ from: null, to: null })
      setTypeFilter("all");
    }

    const handleDateFilterChange = (key, value) => {
      setDateFilter((prev) => ({ ...prev, [key]: value }));
    };

    const handleChange = (event) => {
      setTypeFilter(event.target.value);
    };

    const filterLogFunction = (logData) => {
      const filteredRows = logData.filter((singleLog) => {
        const logDate = new Date(singleLog.timestamp);
        const from = dateFilter.from;
        const to = dateFilter.to;

        // Date range filter
        if (from && isBefore(logDate, from) && !isSameDay(logDate, from))
          return false;
        if (to && isAfter(logDate, to) && !isSameDay(logDate, to)) return false;

        // Type filter
        const logType = singleLog.type; // e.g., "student"        
        if (typeFilter !== "all" && logType !== typeFilter.toLowerCase())
          return false;

        return true;
      });

      return filteredRows;
    };

    useEffect(() => {
      setFilteredLogs(filterLogFunction(logs));
    }, [dateFilter, typeFilter]);

    useEffect(() => {
      if (logData) {
        const studentID = logData?.studentID ?? "Unknown Student";
        const logs = logData?.logs ?? [];
        setStudentIDLog(studentID);
        setLogs(logs);
        setFilteredLogs(filterLogFunction(logs));
      }
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ ml: 2, display: "flex", gap: 2, my: 2 }}>
                  <DatePicker
                    label="From"
                    format="dd/MM/yyyy" // Custom date format
                    value={dateFilter.from ?? null} // explicitly fallback to null
                    onChange={(newValue) =>
                      handleDateFilterChange("from", newValue)
                    }
                    slotProps={{ textField: { size: "small" } }}
                  />
                  <DatePicker
                    label="To"
                    format="dd/MM/yyyy" // Custom date format
                    value={dateFilter.to ?? null}
                    onChange={(newValue) =>
                      handleDateFilterChange("to", newValue)
                    }
                    slotProps={{ textField: { size: "small" } }}
                  />
                  <Button
                    sx={{
                      width: "300px",
                      backgroundColor: colors.greenAccent[500],
                      color: colors.grey[100],
                      "&:hover": { backgroundColor: colors.greenAccent[400] },
                    }}
                    onClick={handleResetFilterDate}
                  >
                    Reset
                  </Button>
                </Box>
              </LocalizationProvider>
              <FormControl
                sx={{
                  ml: 2,
                  display: "flex",
                  gap: 2,
                  my: 2,
                  maxWidth: "20%",
                }}
              >
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  value={typeFilter}
                  label="Type"
                  onChange={handleChange}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="assignment">Assignment</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="payment">Payment</MenuItem>
                  <MenuItem value="file">File</MenuItem>
                </Select>
              </FormControl>
              <Timeline>
                {filteredLogs && filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <TimelineItem key={log._id}>
                      <TimelineOppositeContent
                        sx={{
                          m: "auto 0",
                        }}
                        variant="h6"
                        fontWeight="bold"
                        color={colors.blueAccent[600]}
                      >
                        {format(log.timestamp, "dd/MM/yyyy ")}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot
                          variant="outlined"
                          color={
                            actionTypeTheme[log.action]?.color === "add"
                              ? "success"
                              : actionTypeTheme[log.action]?.color === "update"
                              ? "info"
                              : actionTypeTheme[log.action]?.color === "delete"
                              ? "error"
                              : "grey"
                          }
                        >
                          {actionTypeTheme[log.action]?.icon || ""}
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
                        {log.type === "student" && log.action?.startsWith("update") && log.involvedData?.changedFields && (
                          <Box mt={1}>
                            {Object.entries(log.involvedData.changedFields).map(([field, value]) => (
                              <Typography key={field} variant="body2">
                                {field.charAt(0).toUpperCase() + field.slice(1)}: {value}
                              </Typography>
                            ))}
                          </Box>
                        )}
                        {log.type === "payment" && log.involvedData?.typeData?.paidAmount && (
                          <Typography fontWeight="bold">
                            Amount: {log.involvedData.typeData.paidAmount}
                          </Typography>
                        )}
                        {log.type === "file" && (
                          <Box mt={1}>
                            {log.involvedData?.typeData?.fileName && (
                              <Typography variant="body1" fontWeight="bold">
                                {log.action === "fileUpload"
                                  ? "Uploaded"
                                  : log.action === "fileDownload"
                                  ? "Downloaded"
                                  : "Deleted"
                                }: {log.involvedData.typeData.fileName}
                              </Typography>
                            )}
                          </Box>
                        )}
                        <Typography>
                          {
                            actionTypeTheme[log.action]?.typeData &&
                            log.involvedData?.typeData?.[actionTypeTheme[log.action].typeData]
                          }
                        </Typography>
                        <Typography variant="caption">
                          {log.userName}
                          {" | "}
                          {format(log.timestamp, "hh:mm")}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))
                ) : (
                  <Typography
                    variant="h3"
                    color={colors.grey[100]}
                    sx={{ fontWeight: "bold", mb: 2 }}
                  >
                    No logs for this Student in this Range.
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