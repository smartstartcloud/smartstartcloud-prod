import { Box, Button, Grid, IconButton, TextField, Typography, useTheme } from '@mui/material'
import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form';
import { tokens } from '../../theme';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const AssignmentFieldForm = ({ control, index, refDegreeID }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    fields: assignmentFields,
    append: appendAssignment,
    remove: removeAssignment,
  } = useFieldArray({
    control,
    name: `degreeModules.${index}.assignmentList`, // Access assignmentList for the specific module
  });
  return (
    <Box>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Module Assignment
        </Typography>
        {assignmentFields.map((assignment, assignmentIndex) => (
          <Box
            key={assignment.id}
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Controller
                  name={`degreeModules[${index}].assignmentList[${assignmentIndex}].assignmentName`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Assignment Name"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name={`degreeModules[${index}].assignmentList[${assignmentIndex}].referenceNumber`}
                  control={control}
                  defaultValue={`${
                    refDegreeID ? `${refDegreeID}_M${index + 1}_A` : ""
                  }${assignmentIndex + 1}`}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Reference Number"
                      variant="outlined"
                      fullWidth
                      disabled
                      value={
                        field.value ||
                        `${
                          refDegreeID ? `${refDegreeID}_M${index + 1}_A` : ""
                        }${assignmentIndex + 1}`
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name={`degreeModules[${index}].assignmentList[${assignmentIndex}].assignmentType`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Assignment Type"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name={`degreeModules[${index}].assignmentList[${assignmentIndex}].assignmentDeadline`}
                    control={control}
                    rules={{
                      required: "Assignment Deadline is required", // Validation rule to require the field
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        label="Assignment Deadline"
                        inputFormat="MM/dd/yyyy" // Custom date format
                        value={field.value ? new Date(field.value) : null} // Ensure the value is a Date object
                        onChange={(newValue) => {
                          field.onChange(
                            newValue ? format(newValue, "MM/dd/yyyy") : ""
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant="outlined"
                            required
                            error={!!error} // Display error if validation fails
                            helperText={error ? error.message : null} // Show the error message
                          />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={1} sx={{ alignSelf: "flex-start" }}>
                <IconButton
                  onClick={() => removeAssignment(assignmentIndex)}
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
              </Grid>
            </Grid>
          </Box>
        ))}
      </Grid>
      <Button
        variant="contained"
        sx={{
          marginLeft: "16px",
          backgroundColor: colors.grey[200],
          color: colors.grey[900],
          "&:hover": { backgroundColor: colors.grey[100] },
        }}
        onClick={() =>
          appendAssignment({
            assignmentName: "",
            assignmentType: "",
            assignmentDeadline: "",
          })
        }
        startIcon={<AddIcon />}
      >
        Add Assignment
      </Button>
    </Box>
  );
};

export default AssignmentFieldForm