import { Box, Card, CardContent, Container, IconButton, Modal, Typography, useTheme } from '@mui/material';
import React from 'react'
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

const customScrollbarStyles = {
  "&::-webkit-scrollbar": {
    display: "none",
  },
  msOverflowStyle: "none", // ✅ IE/Edge -ms-overflow-style
  scrollbarWidth: "none", // ✅ Firefox
};

const StudentHistory = ({
    open,
    setOpen
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);  
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
              <Timeline
                sx={{
                  [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                  },
                }}
              >
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    09:30 am
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>Eat</TimelineContent>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>
        </Container>
      </Modal>
    );
}

export default StudentHistory