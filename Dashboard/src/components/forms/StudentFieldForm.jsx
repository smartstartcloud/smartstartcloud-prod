import React from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Checkbox,
} from "@mui/material";
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
        studentOther: student[6],
        groupName: student[7],
        tutorName: student[8],
        campusLocation: student[9],
        isExternal: student[10]?.toLowerCase() === "yes",
        universityName: student[11] || "",
        courseName: student[12] || "",
        year: student[13] || "",
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
                {/** Student Information Fields */}
                {[
                  { name: "studentID", label: "Student ID", tooltip: "Student ID", sm: 4 },
                  { name: "studentName", label: "Student Name", tooltip: "Enter Student Name", sm: 4, required: true },
                  { name: "studentContact", label: "Student Contact", tooltip: "Enter Student Contact", sm: 4 },
                  { name: "studentLogin", label: "Student Username", tooltip: "Enter Student Username", sm: 6 },
                  { name: "studentPassword", label: "Student Password", tooltip: "Enter Student Password", sm: 3 },
                  { name: "studentOfficePassword", label: "Student Office Password", tooltip: "Enter Student Office Password", sm: 3 },
                  { name: "studentOther", label: "Student Other Information", tooltip: "Enter Student Other Information", sm: 6 },
                  { name: "groupName", label: "Group Name", tooltip: "Enter Group Name", sm: 6 },
                  { name: "tutorName", label: "Tutor Name", tooltip: "Enter Tutor Name", sm: 6 },
                  { name: "campusLocation", label: "Campus Location", tooltip: "Enter Campus Location", sm: 6 },
                ].map(({ name, label, tooltip, sm, required }) => (
                  <Grid item xs={12} sm={sm} key={name}>
                    <Controller
                      name={`degreeStudentList[${index}].${name}`}
                      control={control}
                      render={({ field }) => (
                        <Tooltip title={tooltip}>
                          <TextField
                            {...field}
                            label={label}
                            variant="outlined"
                            fullWidth
                            required={required}
                          />
                        </Tooltip>
                      )}
                    />
                  </Grid>
                ))}

                {/** External Student Checkbox */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name={`degreeStudentList[${index}].isExternal`}
                    control={control}
                    render={({ field }) => (
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Checkbox onChange={()=>{console.log(field.value);
                        }} {...field} checked={field.value} />
                        <Tooltip title="Is the student external?">
                          <Typography variant="body1">External Student</Typography>
                        </Tooltip>
                      </Box>
                    )}
                  />
                </Grid>

                {/** External Student Fields (Conditional) */}
                {[
                  { name: "universityName", label: "University Name" },
                  { name: "courseName", label: "Course Name" },
                  { name: "year", label: "Year" },
                ].map(({ name, label }) => (
                  <Grid item xs={12} sm={6} key={name}>
                    <Controller
                      name={`degreeStudentList[${index}].${name}`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={label}
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/** Remove Student Button */}
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

      {/** Add Student Button */}
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
            studentOfficePassword: "",
            studentOther: "",
            isExternal: false,
            universityName: "",
            courseName: "",
            year: "",
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