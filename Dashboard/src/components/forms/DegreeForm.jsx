import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import {
    Button,
    TextField,
    Typography,
    Box,
    IconButton,
    Grid,
    Select,
    MenuItem,
    Tooltip,
    Snackbar,
    useTheme,
    Alert, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { v4 as uuidv4 } from 'uuid';
import MuiAlert from '@mui/material/Alert';
import { tokens } from '../../theme';
import useSendDegreeForm from '../../hooks/useSendDegreeForm';
import useFetchAgentList from '../../hooks/useFetchAgentList';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AssignmentFieldForm from './AssignmentFieldForm';
import StudentFieldForm from './StudentFieldForm';
import { extractObjects } from '../../utils/functions';
import useFetchSingleDegreeData from '../../hooks/useFetchSingleDegreeData';


const currentYear = new Date().getFullYear();
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const DegreeForm = ({editPage=false}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { degreeYear, degreeId } = useParams();
  const [open, setOpen] = useState(false);
  const [formSaved, setFormSaved] = useState(false);
  const [formError, setFormError] = useState(false);
  const [monthYear, setMonthYear] = useState({ month: "", year: "" });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { degree } = useFetchSingleDegreeData(degreeId, editPage);

  const location = useLocation();  
  var editMode;

  if (editPage) {
    const state = location?.state;
    editMode = state.editMode;
  }

  const navigate = useNavigate();

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      degreeID: "",
      degreeYear: "",
      degreeName: "",
      degreeAgent: "",
      degreeStudentList: [],
      degreeModules: [
        {
          moduleName: "",
          moduleCode: "",
          moduleCost: "",
          assignmentList: [],
        },
      ],
    },
  });

  useEffect(() => {
    if (editPage, degree) {
      if (editMode) {
        const existingMonthYear = degree.degreeYear.split("_")[0];
        const existingMonth = existingMonthYear.charAt(0).toUpperCase() + existingMonthYear.slice(1);
        const existingYear = degree.degreeYear.split("_")[1];
        setMonthYear({
          month: existingMonth,
          year: existingYear,
        });
        
        reset({
          _id: degree._id,
          degreeID: degree?.degreeID || "",
          degreeYear: degree?.degreeYear || "",
          degreeName: degree?.degreeName || "",
          degreeAgent: degree?.degreeAgent._id || "",
          degreeStudentList:
            degree?.degreeStudentList.map((student) => ({
              _id: student._id,
              studentID: student.studentID || "",
              studentName: student.studentName || "",
              studentContact: student.studentContact || "",
              studentLogin: student.studentLogin || "",
              studentPassword: student.studentPassword || "",
              studentOfficePassword: student.studentOfficePassword || "",
              studentOther: student.studentOther || "",
              groupName: student.groupName || "",
              tutorName: student.tutorName || "",
              campusLocation: student.campusLocation || "",
              universityName: student.universityName || "",
              courseName: student.courseName || "",
              year: student.year || "",
              isExternal: student.isExternal || "",
              
            })) || [],
          degreeModules:
            degree?.degreeModules?.map((module) => ({
              _id: module._id,
              moduleName: module.moduleName || "",
              moduleCode: module.moduleCode || "",
              moduleCost: module.moduleCost || "",
              assignmentList:
                extractObjects(module.moduleAssignments)?.map((assignment) => ({
                  _id: assignment._id,
                  assignmentName: assignment.assignmentName || "", // Placeholder for assignment details if needed
                  referenceNumber: assignment.referenceNumber || "",
                  assignmentType: assignment.assignmentType || "", // Placeholder for assignment type if needed
                  assignmentDeadline: assignment.assignmentDeadline || "", // Placeholder for deadline if needed
                  wordCount: assignment.wordCount || "",
                })) || [],
            })) || [],
        });
      }
    }
  }, [degree, reset, editMode, editPage]);

  // Watch for changes to the degreeID field
  const refDegreeID = watch("degreeID"); // This will hold the current value of degreeID

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: "degreeModules",
  });

  const { agentList } = useFetchAgentList();

  const { sendDegreeForm } = useSendDegreeForm();

  const onSubmit = async (data) => {
    const modules = {};
    data.degreeYear = `${monthYear.month.toLowerCase()}_${monthYear.year}`;

    data.degreeModules.forEach((module, index) => {
      module.moduleName = `Module ${index + 1}`;
      module.moduleCode = `${refDegreeID ? `${refDegreeID}_M` : ""}${
        index + 1
      }`;
      module.moduleCost = module.moduleCost || 0;
      module.assignmentList.forEach((assignment, assignmentIndex)=> {
        assignment.referenceNumber = `${refDegreeID ? `${refDegreeID}_M${index + 1}_A` : ""}${assignmentIndex + 1}`;
      })
    });    
    setLoading(true);
    try {
      const response = await sendDegreeForm(data, editMode);
      console.log("Form Data:", data);
      console.log('Response Data:', response);
      // navigate(0);

      setFormSaved(true);
      setLoading(false);
    } catch (e) {
      setFormError(true);
      setLoading(false);
      setErrorMessage(e.message);
      console.log("Error submitting form: ", e.message);
    }
  };

  const handleClose = () => {
    setFormSaved(false);
  };

  const handleCloseError = () => {
    setFormError(false);
  };



  return (
    <Box
      sx={{
        p: 3,
        width: "90%",
        maxWidth: "90%",
        margin: "0 auto",
        mt: 5,
        border: "1px solid rgba(102, 106, 108, 0.5)",
        borderRadius: "8px",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: colors.grey[300],
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.grey[100],
          },
        },
        "& .MuiInputLabel-root": {
          color: colors.grey[300],
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: colors.grey[100],
        },
      }}
    >
      <Typography variant="h4" gutterBottom>
        {editMode ? "Edit Degree Form" : "Degree Form"}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} sm={6} sx={{ mt: 4, mb: 3, width: "49.5%" }}>
          <Controller
            name="degreeID"
            control={control}
            render={({ field }) => (
              <Tooltip title="Enter the Degree ID">
                <TextField
                  {...field}
                  label="Degree ID"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Tooltip>
            )}
          />
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Tooltip title="Select the Degree Month">
              <Select
                value={monthYear.month}
                onChange={(e) =>
                  setMonthYear({ ...monthYear, month: e.target.value })
                } // Set month
                fullWidth
                displayEmpty
                required
              >
                <MenuItem value="" disabled>
                  Select Month
                </MenuItem>
                {months.map((month, index) => (
                  <MenuItem key={index} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
          </Grid>

          <Grid item xs={6}>
            <Tooltip title="Select the Degree Year">
              <Select
                value={monthYear.year}
                onChange={(e) =>
                  setMonthYear({ ...monthYear, year: e.target.value })
                } // Set year
                fullWidth
                displayEmpty
                required
              >
                <MenuItem value="" disabled>
                  Select Year
                </MenuItem>
                {Array.from({ length: 30 }, (_, i) => (
                  <MenuItem key={i} value={currentYear - i}>
                    {currentYear - i}
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="degreeName"
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter the Degree Name">
                  <TextField
                    {...field}
                    label="Degree Name"
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Tooltip>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="degreeAgent"
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter the Agent Name">
                  <Select
                    {...field}
                    variant="outlined"
                    fullWidth
                    required
                    displayEmpty
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="" disabled>
                      Select Agent
                    </MenuItem>
                    {agentList?.map((agent, idx) => (
                      <MenuItem key={agent._id || idx} value={agent._id}>
                        {`${agent.firstName} ${agent.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                </Tooltip>
              )}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Degree Students
        </Typography>
        <Typography
          variant="p"
          gutterBottom
          sx={{ mt: 4, mb: 2, paddingTop: 2, paddingBottom: 2 }}
        >
          Please use this{" "}
          <a
            href="https://docs.google.com/spreadsheets/d/15mkFlq3AB5YjgpTVgOyv3wNd-GzGKO1sBJqifltg7As/edit?usp=sharing"
            target="_blank"
          >
            template
          </a>{" "}
          when uploading students in bulk using a CSV file.
        </Typography>
        <Grid item sm={12}>
          <StudentFieldForm control={control} />
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Degree Modules
        </Typography>
        {moduleFields.map((field, index) => (
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name={`degreeModules[${index}].moduleName`}
                  control={control}
                  defaultValue={`Module ${index + 1}`}
                  render={({ field }) => (
                    <Tooltip title="Module Name">
                      <TextField
                        {...field}
                        label="Module Name"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={field.value || `Module ${index + 1}`}
                      />
                    </Tooltip>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name={`degreeModules[${index}].moduleCode`}
                  control={control}
                  defaultValue={`${refDegreeID ? `${refDegreeID}_M` : ""}${
                    index + 1
                  }`}
                  render={({ field }) => (
                    <Tooltip title="Module Code">
                      <TextField
                        {...field}
                        label="Module Code"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={
                          field.value ||
                          `${refDegreeID ? `${refDegreeID}_M` : ""}${index + 1}`
                        }
                      />
                    </Tooltip>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <AssignmentFieldForm
                  control={control}
                  index={index}
                  refDegreeID={refDegreeID}
                />
              </Grid>

              <Grid item xs={12} sm={1} sx={{ alignSelf: "flex-start" }}>
                <IconButton
                  onClick={() => removeModule(index)}
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

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.grey[200],
              color: colors.grey[900],
              "&:hover": { backgroundColor: colors.grey[100] },
            }}
            onClick={() => appendModule({ moduleName: "", moduleCode: "", moduleCost: "" })}
            startIcon={<AddIcon />}
          >
            Add Module
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "200px",
              backgroundColor: colors.grey[200],
              color: colors.grey[900],
              "&:hover": { backgroundColor: colors.grey[100] },
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: colors.grey[900] }} />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </form>

      <Snackbar open={formSaved} autoHideDuration={3000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="success"
        >
          Form submitted successfully!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={formError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          Form submission failed. {errorMessage}. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DegreeForm;
