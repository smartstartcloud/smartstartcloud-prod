import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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

const currentYear = new Date().getFullYear();

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const DegreeForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
    const [formSaved, setFormSaved] = useState(false);
    const [formError, setFormError] = useState(false);
    const [monthYear, setMonthYear] = useState({ month: '', year: '' });
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);


    const { control, handleSubmit } = useForm({
        defaultValues: {
            degreeID: '',
            degreeYear: '',
            degreeName: '',
            degreeAgent: '',
            degreeStudentList: [{ studentID: '', studentName: '', studentContact: '', studentUsername: '', studentPassword: '', studentAssignmentList: [] }],
            degreeModules: [{ moduleName: '', moduleCode: '' }]

        }
    });

    const { fields: studentFields, append: appendStudent, remove: removeStudent } = useFieldArray({
        control,
        name: 'degreeStudentList'
    });

    const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
        control,
        name: 'degreeModules'
    });

    const { agentList } = useFetchAgentList();
    
    const { sendDegreeForm } = useSendDegreeForm();

    const onSubmit = async (data) => {
        const modules = {};
        data.degreeYear = `${monthYear.month.toLowerCase()}_${monthYear.year}`;
        
        data.degreeModules.forEach((module, index) => {            
            module.moduleName = `Module ${index + 1}`
            // modules[`Module ${index + 1}`] = module.moduleCode;
        });
        

        // const finalData = {
        //     ...data,
        //     degreeModules: modules
        // }

        setLoading(true);
        try{
            const response = await sendDegreeForm(data)
            console.log('Form Data:', data);
            // console.log('Response Data:', response);
            setFormSaved(true);
            setLoading(false);
        }catch (e) {
            setFormError(true);
            setLoading(false)
            setErrorMessage(e.message)
            console.log("Error submitting form: ", e.message)
        }

    };

    const handleClose = () => {
        setFormSaved(false);
    };

    const handleCloseError = () => {
        setFormError(false);
    };

    return (
        <Box sx={{ p: 3, width: '80%', maxWidth: '80%', margin: '0 auto', mt: 5 , border: '1px solid rgba(102, 106, 108, 0.5)',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: colors.grey[300],
                },
                '&.Mui-focused fieldset': {
                    borderColor: colors.grey[100],
                },
            },
            '& .MuiInputLabel-root': {
                color: colors.grey[300],
            },
            '& .MuiInputLabel-root.Mui-focused': {
                color: colors.grey[100],
            },
        }}>
            <Typography variant="h4" gutterBottom>Degree Form</Typography>

            <form onSubmit={handleSubmit(onSubmit)}>


                <Grid item xs={12} sm={6} sx={{ mt: 4, mb: 3, width: "49.5%" }}>
                    <Tooltip title="Enter the Degree ID">
                        <Controller
                            name="degreeID"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Degree ID"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            )}
                        />
                    </Tooltip>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Tooltip title="Select the Degree Month">
                            <Select
                                value={monthYear.month}
                                onChange={(e) => setMonthYear({ ...monthYear, month: e.target.value })} // Set month
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
                                onChange={(e) => setMonthYear({ ...monthYear, year: e.target.value })} // Set year
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
                        <Tooltip title="Enter the Degree Name">
                            <Controller
                                name="degreeName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Degree Name"
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                )}
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Tooltip title="Enter the Agent Name">
                            {/* <Controller
                                name="degreeAgent"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Agent Name"
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                )}
                            /> */}
                            <Controller
                                name='degreeAgent'
                                control={control}
                                render={({field})=>(
                                    <Select
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        required
                                        displayEmpty
                                        sx={{ mb: 2 }}
                                    >
                                        <MenuItem value="" disabled>Select Agent</MenuItem>
                                        {agentList?.map((agent) => (
                                            <MenuItem key={agent._id} value={agent._id}>
                                                {`${agent.firstName} ${agent.lastName}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </Tooltip>
                    </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>Degree Students</Typography>
                {studentFields.map((field, index) => (
                    <Box
                        key={field.id}
                        sx={{
                            mb: 3,
                            width: '100%',
                            border: '1px solid rgba(102, 106, 108, 0.5)',
                            borderRadius: '8px',
                            position: 'relative',
                            padding: '16px',
                            transition: 'border-color 0.3s ease',
                            '&:hover': {
                                borderColor: 'rgba(102, 106, 108, 0.9)',
                            },
                        }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Tooltip title="Student ID (Auto-generated)">
                                            <Controller
                                                name={`degreeStudentList[${index}].studentID`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Student ID"
                                                        variant="outlined"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Tooltip title="Enter Student Name">
                                            <Controller
                                                name={`degreeStudentList[${index}].studentName`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Student Name"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                    />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Tooltip title="Enter Student Contact">
                                            <Controller
                                                name={`degreeStudentList[${index}].studentContact`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Student Contact"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                    />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Tooltip title="Enter Student Username">
                                            <Controller
                                                name={`degreeStudentList[${index}].studentLogin`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Student Username"
                                                        variant="outlined"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Tooltip title="Enter Student Password">
                                            <Controller
                                                name={`degreeStudentList[${index}].studentPassword`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Student Password"
                                                        variant="outlined"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Tooltip title="Remove Student">
                            <IconButton
                                onClick={() => removeStudent(index)}
                                sx={{
                                    position: 'absolute',
                                    top: '-9px',
                                    right: '-9px',
                                    backgroundColor: 'grey',
                                    color: 'white',
                                    borderRadius: '50%',
                                    height: "20px",
                                    width: "20px",
                                    '&:hover': {
                                        backgroundColor: 'white',
                                        color: 'grey',
                                        cursor: 'pointer',
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
                        '&:hover': {backgroundColor: colors.grey[100]}
                    }}
                    onClick={() => appendStudent({ studentID: '', studentName: '', studentContact: '', studentLogin: '', studentPassword: '', studentAssignmentList: [] })}
                    startIcon={<AddIcon />}
                >
                    Add Student
                </Button>

                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb:2 }}>Degree Modules</Typography>
                {moduleFields.map((field, index) => (
                    <Box key={field.id} sx={{
                        mb: 3,
                        width: '100%',
                        border: '1px solid rgba(102, 106, 108, 0.5)',
                        borderRadius: '8px',
                        position: 'relative',
                        padding: '16px',
                        transition: 'border-color 0.3s ease',
                        '&:hover': {
                            borderColor: 'rgba(102, 106, 108, 0.9)',
                        },
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={`Module ${index + 1}`}
                                    label="Module Name"
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <Tooltip title="Enter Module Code">
                                    <Controller
                                        name={`degreeModules[${index}].moduleCode`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Module Code"
                                                variant="outlined"
                                                fullWidth
                                                required
                                            />
                                        )}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={1} sx={{ alignSelf: 'flex-start' }}>
                                <IconButton onClick={() => removeModule(index)}
                                            sx={{
                                                position: 'absolute',
                                                top: '-9px',
                                                right: '-9px',
                                                backgroundColor: 'grey',
                                                color: 'white',
                                                borderRadius: '50%',
                                                height: "20px",
                                                width: "20px",
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                    color: 'grey',
                                                    cursor: 'pointer',
                                                },
                                            }}>
                                    <RemoveIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                ))}


                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4}}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: colors.grey[200],
                            color: colors.grey[900],
                            '&:hover': {backgroundColor: colors.grey[100]}
                        }}
                        onClick={() => appendModule({ moduleName: '', moduleCode: '' })}
                        startIcon={<AddIcon />}
                    >
                        Add Module
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            width: '200px',
                            backgroundColor: colors.grey[200],
                            color: colors.grey[900],
                            '&:hover': {backgroundColor: colors.grey[100]}
                        }}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: colors.grey[900] }} />
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </Box>

            </form>

            <Snackbar open={formSaved} autoHideDuration={3000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="success">
                    Form submitted successfully!
                </MuiAlert>
            </Snackbar>
            <Snackbar open={formError} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    Form submission failed. {errorMessage}. Please try again.
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DegreeForm;
