import {Box,Button,Grid,IconButton,TextField,Tooltip,useTheme,} from "@mui/material";
import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { tokens } from "../../theme";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import UploadFileIcon from "@mui/icons-material/UploadFile";


const StudentFieldForm = ({ control }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {
    fields: studentFields,
    append: appendStudent,
    remove: removeStudent,
    } = useFieldArray({
    control,
    name: "degreeStudentList",
    });

    const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files[0]) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
        const csvContent = e.target.result;
        parseCSV(csvContent);
        };

        reader.readAsText(file);
    }
    };

    const parseCSV = (csvContent) => {
    const rows = csvContent.split("\n").filter((row) => row.trim() !== "");
    const data = rows.map((row) =>
        row.split(",").map((cell) => cell.trim())
    );
    // console.log("Parsed CSV Data:", data);
    populateStudentData(data);
    };

    const populateStudentData = (data) => {
    const studentListToPopulate = data.slice(1);
    for (let student of studentListToPopulate) {
        appendStudent({
        studentID: student[0],
        studentName: student[1],
        studentContact: student[2],
        studentLogin: student[3],
        studentPassword: student[4],
        studentOfficePassword: student[5],
        studentOther: student[6]

        });
    }
    };
    return (
      <Box>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            component="label"
            color="secondary"
            startIcon={<UploadFileIcon />}
            style={{
              width: "100%",
              padding: "10px 20px",
              marginBottom: "20px",
              marginRight: "10px",
            }}
          >
            Upload Student List
            <input type="file" onChange={handleFileChange} hidden multiple />
          </Button>
        </Grid>
        {studentFields.map((field, index) => (
  <Box
    key={field.id}
    sx={{
      mb: 3,
      width: "100%",
      border: "1px solid rgba(102, 106, 108, 0.5)",
      borderRadius: "8px",
      position: "relative",
      padding: "16px",
      transition: "border-color 0.3s ease",
      "&:hover": {
        borderColor: "rgba(102, 106, 108, 0.9)",
      },
    }}
  >
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Controller
              name={`degreeStudentList[${index}].studentID`}
              control={control}
              render={({ field }) => (
                <Tooltip title="Student ID (Auto-generated)">
                  <TextField
                    {...field}
                    label="Student ID"
                    variant="outlined"
                    fullWidth
                  />
                </Tooltip>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name={`degreeStudentList[${index}].studentName`}
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter Student Name">
                  <TextField
                    {...field}
                    label="Student Name"
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Tooltip>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name={`degreeStudentList[${index}].studentContact`}
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter Student Contact">
                  <TextField
                    {...field}
                    label="Student Contact"
                    variant="outlined"
                    fullWidth
                  />
                </Tooltip>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`degreeStudentList[${index}].studentLogin`}
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter Student Username">
                  <TextField
                    {...field}
                    label="Student Username"
                    variant="outlined"
                    fullWidth
                  />
                </Tooltip>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name={`degreeStudentList[${index}].studentPassword`}
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter Student Password">
                  <TextField
                    {...field}
                    label="Student Password"
                    variant="outlined"
                    fullWidth
                  />
                </Tooltip>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name={`degreeStudentList[${index}].studentOfficePassword`}
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter Student Office Password">
                  <TextField
                    {...field}
                    label="Student Office Password"
                    variant="outlined"
                    fullWidth
                  />
                </Tooltip>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`degreeStudentList[${index}].studentOther`}
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter Student Other Information">
                  <TextField
                    {...field}
                    label="Student Other Information"
                    variant="outlined"
                    fullWidth
                  />
                </Tooltip>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`degreeStudentList[${index}].groupName`}
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter Group Name">
                  <TextField
                    {...field}
                    label="Group Name"
                    variant="outlined"
                    fullWidth
                  />
                </Tooltip>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`degreeStudentList[${index}].tutorName`}
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter Tutor Name">
                  <TextField
                    {...field}
                    label="Tutor Name"
                    variant="outlined"
                    fullWidth
                  />
                </Tooltip>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`degreeStudentList[${index}].campusLocation`}
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter Campus Location">
                  <TextField
                    {...field}
                    label="Campus Location"
                    variant="outlined"
                    fullWidth
                  />
                </Tooltip>
              )}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>

    <Tooltip title="Remove Student">
      <IconButton
        onClick={() => removeStudent(index)}
        sx={{
          position: "absolute",
          top: "-9px",
          right: "-9px",
          backgroundColor: "grey",
          color: "white",
          borderRadius: "50%",
          height: "20px",
          width: "20px",
          "&:hover": {
            backgroundColor: "white",
            color: "grey",
            cursor: "pointer",
          },
        }}
      >
        <RemoveIcon />
      </IconButton>
    </Tooltip>
  </Box>
))}


        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.grey[200],
            color: colors.grey[900],
            "&:hover": { backgroundColor: colors.grey[100] },
          }}
          onClick={() =>
            appendStudent({
              studentID: "",
              studentName: "",
              studentContact: "",
              studentLogin: "",
              studentPassword: "",
              studentAssignmentList: [],
              studentOfficePassword: "",
              studentOther: ""
            })
          }
          startIcon={<AddIcon />}
        >
          Add Student
        </Button>
      </Box>
    );
};

export default StudentFieldForm;
