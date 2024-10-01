import React from 'react'
import {Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const AssignmentList = ({list}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box>
            {list && <Box mt={3} width='100%'>
                <Typography variant="h3" color={colors.grey[100]} sx={{ fontWeight: 'bold', mb: 2}}>
                    Assignment List for {(list.find(item => item.moduleName))?.moduleName}
                </Typography>
                <Grid container spacing={2} width='100%' mt={2}>
                    {list.filter((assignment)=>!assignment.moduleName).map((assignment) =>( 
                        <Accordion sx={{width: '100%', background: colors.grey[900], color: colors.grey[200], marginBottom: '10px'}}>
                            <AccordionSummary
                            expandIcon={<ArrowDropDownIcon sx={{color: colors.grey[200]}} />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                            >
                                <Grid item xs={6} sm={3} >
                                    <Typography>
                                        {assignment.orderID}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3} >
                                    <Typography>
                                        {assignment.assignmentName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3} >
                                    <Typography>
                                        {assignment.assignmentType}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3} >
                                    <Typography>
                                        {assignment.assignmentDeadline}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={2} >
                                    <Typography>
                                        {assignment.assignmentProgress}%
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={1} >
                                    <Typography>
                                        {assignment.assignmentPayment}
                                    </Typography>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails sx={{background: colors.grey[800], color: colors.grey[200]}}>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>
            </Box>}
            
        </Box>
    )
}

export default AssignmentList