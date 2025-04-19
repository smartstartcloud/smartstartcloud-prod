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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Controller, useFieldArray } from "react-hook-form";
import { tokens } from "../../theme";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Papa from "papaparse";

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

  // 1. Define a header mapping
  const HEADER_MAP = {
    "Student Status": "studentStatus",
    "Student ID": "studentID",
    "Student Name": "studentName",
    "Student Contact": "studentContact",
    "Student Username": "studentLogin",
    "Student Password": "studentPassword",
    "Office 365 Password": "studentOfficePassword",
    "Other Information": "studentOther",
    "Group Name": "groupName",
    "Tutor Name": "tutorName",
    "Campus Location": "campusLocation",
    "Is External": "isExternal",
    "University Name": "universityName",
    "Course Name": "courseName",
    "Year": "year",
  };

  // 2. Normalize headers and map data
  const normalizeCSVData = (rawData) => {
    return rawData.map((row) => {      
      const normalized = {};
      for (const [originalKey, value] of Object.entries(row)) {        
        const mappedKey = HEADER_MAP[originalKey.trim()];
        if (mappedKey) {
          normalized[mappedKey] = value?.trim() || "";
        }
      }      
      // Add default fallback
      normalized.studentStatus = normalized.studentStatus || "noStatus";
      normalized.isExternal = normalized.isExternal?.toLowerCase() === "yes";
      return normalized;
    });
  };

  // 3. File handler
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files[0]) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {          
          const parsed = normalizeCSVData(results.data);                    
          populateStudentData(parsed);
        },
        error: function (err) {
          console.error("CSV Parse Error:", err);
        },
      });
    }
  };

  // const handleFileChange = (event) => {
  //   const files = event.target.files;
  //   if (files && files[0]) {
  //     const file = files[0];
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       const csvContent = e.target.result;
  //       parseCSV(csvContent);
  //     };

  //     reader.readAsText(file);
  //   }
  // };

  // const parseCSV = (csvContent) => {
  //   const rows = csvContent
  //     .split("\n")
  //     .map((row) => row.trim())
  //     .filter((row) => row !== "");

  //   if (rows.length === 0) return;

  //   const headers = rows[0].split(",").map((h) => h.trim());
  //   const data = rows.slice(1).map((row) => {
  //     const cells = row.split(",").map((cell) => cell.trim());
  //     const obj = {};

  //     headers.forEach((key, index) => {
  //       obj[key] = cells[index] ?? "";
  //     });

  //     return obj;
  //   });
  //   console.log(data);

  //   // populateStudentData(data);
  // };

  const populateStudentData = (data) => {
    for (let student of data) {
      appendStudent({
        studentStatus: student.studentStatus?.trim() || "",
        studentID: student.studentID?.trim() || "",
        studentName: student.studentName?.trim() || "",
        studentContact: student.studentContact?.trim() || "",
        studentLogin: student.studentLogin?.trim() || "",
        studentPassword: student.studentPassword?.trim() || "",
        studentOfficePassword: student.studentOfficePassword?.trim() || "",
        studentOther: student.studentOther?.trim() || "",
        groupName: student.groupName?.trim() || "",
        tutorName: student.tutorName?.trim() || "",
        campusLocation: student.campusLocation?.trim() || "",
        isExternal: student.isExternal,
        universityName: student.universityName?.trim() || "",
        courseName: student.courseName?.trim() || "",
        year: student.year?.trim() || "",
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
                  {
                    name: "studentStatus",
                    label: "Student Status",
                    tooltip: "Student Status",
                    sm: 2,
                  },
                  {
                    name: "studentID",
                    label: "Student ID",
                    tooltip: "Student ID",
                    sm: 2,
                  },
                  {
                    name: "studentName",
                    label: "Student Name",
                    tooltip: "Enter Student Name",
                    sm: 4,
                    required: true,
                  },
                  {
                    name: "studentContact",
                    label: "Student Contact",
                    tooltip: "Enter Student Contact",
                    sm: 4,
                  },
                  {
                    name: "studentLogin",
                    label: "Student Username",
                    tooltip: "Enter Student Username",
                    sm: 6,
                  },
                  {
                    name: "studentPassword",
                    label: "Student Password",
                    tooltip: "Enter Student Password",
                    sm: 3,
                  },
                  {
                    name: "studentOfficePassword",
                    label: "Student Office Password",
                    tooltip: "Enter Student Office Password",
                    sm: 3,
                  },
                  {
                    name: "studentOther",
                    label: "Student Other Information",
                    tooltip: "Enter Student Other Information",
                    sm: 6,
                  },
                  {
                    name: "groupName",
                    label: "Group Name",
                    tooltip: "Enter Group Name",
                    sm: 6,
                  },
                  {
                    name: "tutorName",
                    label: "Tutor Name",
                    tooltip: "Enter Tutor Name",
                    sm: 6,
                  },
                  {
                    name: "campusLocation",
                    label: "Campus Location",
                    tooltip: "Enter Campus Location",
                    sm: 6,
                  },
                ].map(({ name, label, tooltip, sm, required }) => (
                  <Grid item xs={12} sm={sm} key={name}>
                    <Controller
                      name={`degreeStudentList[${index}].${name}`}
                      control={control}
                      render={({ field }) => (
                        <Tooltip title={tooltip}>
                          {name === "studentStatus" ? (
                            <FormControl fullWidth required={required}>
                              <InputLabel id={`student-status-label-${index}`}>
                                {label}
                              </InputLabel>
                              <Select
                                {...field}
                                labelId={`student-status-label-${index}`}
                                label={label}
                              >
                                <MenuItem value="noStatus">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value="active">ACTIVE</MenuItem>
                                <MenuItem value="inactive">INACTIVE</MenuItem>
                                <MenuItem value="withdrawn">WITHDRAWN</MenuItem>
                              </Select>
                            </FormControl>
                          ) : name === "studentOther" ? (
                            <TextField
                              {...field}
                              label={label}
                              variant="outlined"
                              fullWidth
                              required={required}
                              multiline
                              rows={3}
                            />
                          ) : (
                            <TextField
                              {...field}
                              label={label}
                              variant="outlined"
                              fullWidth
                              required={required}
                            />
                          )}
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Checkbox
                          onChange={() => {
                            console.log(field.value);
                          }}
                          {...field}
                          checked={field.value}
                        />
                        <Tooltip title="Is the student external?">
                          <Typography variant="body1">
                            External Student
                          </Typography>
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
            studentStatus: "",
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