import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { tokens } from '../../theme'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Dialog,
  useTheme,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import FileUpload from '../FileUpload';
import useFetchModuleData from '../../hooks/useFetchModuleData';
import ModuleAssignmentTable from '../ModuleAssignmentTable';


const ModuleProfile = () => {
  const { degreeId, moduleCode } = useParams()
  const [orderIdToPass, setOrderIdToPass] = useState(moduleCode);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation()
  const { moduleId } = location.state || [];  
  // console.log(degreeId, moduleCode, moduleId);
  const { moduleData, loading, error } = useFetchModuleData(degreeId, moduleId);
  const handleFileOpen = () => {
    setOpen(true);
  };
  
  return (
    <Box m="20px auto" display="flex" flexDirection="column" maxWidth="1000px">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        mb={2}
      >
        <Card
          sx={{
            width: "100%",
            p: 2,
            background: `linear-gradient(145deg, ${colors.greenAccent[700]}, ${colors.greenAccent[500]})`,
            boxShadow: 6,
            borderRadius: 4,
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              color={colors.grey[100]}
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Module Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Module Code:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color={colors.grey[100]}>
                  {moduleCode}
                </Typography>
              </Grid>

              {/* <Grid item xs={6}>
                <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Module Name:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color={colors.grey[100]}>
                  {"a"}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Module Assignments:
                </Typography>
              </Grid>
              <Grid item xs={6} display="flex" gap={2}>
                <Typography variant="h6" color={colors.grey[100]}>
                  {"Essay"}
                </Typography>
                <Typography variant="h6" color={colors.grey[100]}>
                  {"Essay"}
                </Typography>
              </Grid> */}

              {/* <Grid item xs={12}>
                <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Module Abstract:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" color={colors.grey[100]}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Molestias maiores laborum repellat voluptatibus. Sed, possimus
                  porro aliquam quos expedita qui commodi tempora debitis, illo
                  voluptas inventore ipsa dolore recusandae totam. Nostrum
                  explicabo consectetur a illum, molestiae ad odio velit
                  accusantium quo corrupti at eligendi quia, iure porro veniam
                  quos, impedit inventore voluptatum. Ut magnam doloremque
                  quidem unde voluptatibus? Veritatis exercitationem accusamus
                  facilis tempora quidem animi. Quasi ea expedita dicta tempore
                  eveniet modi, adipisci sapiente accusamus explicabo tempora?
                  Numquam voluptate laborum quia ab qui quis. Ad in sapiente,
                  dolore nulla ab fuga quasi? Qui iusto error expedita eligendi!
                  Repellendus, qui nobis?
                </Typography>
              </Grid> */}
              <Grid item container alignItems="center" spacing={1}>
                <Grid item>
                  <Button
                    onClick={handleFileOpen}
                    startIcon={<FolderOpenOutlinedIcon />}
                    sx={{
                      backgroundColor: colors.grey[100], // Set background color
                      color: colors.grey[900], // Set text color
                      "&:hover": {
                        backgroundColor: colors.grey[200], // Set hover color
                      },
                    }}
                    variant="contained" // or "outlined" based on your styling preference
                  >
                    Open Module Brief
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {moduleData && moduleData.moduleData && (
          <Box m="20px 0px">
            <ModuleAssignmentTable studentData={moduleData.moduleData} />
          </Box>
        )}
        {open && (
          <FileUpload
            setOpen={setOpen}
            open={open}
            orderID={orderIdToPass}
            isModule={true}
          />
        )}
      </Box>
    </Box>
  );
}

export default ModuleProfile