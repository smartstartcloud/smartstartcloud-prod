import React from 'react';
import { Card, CardContent, Typography, CardActionArea, Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';

const DegreeCard = ({ degreeYear, degreeId, degreeName, totalStudents, degreeAgent }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/task/${degreeYear}/${degreeId}`);
    };

    return (
        <Card
            onClick={handleClick}
            sx={{
                minWidth: '100%',
                background: colors.grey[100],
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '10px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                },
            }}>
            <CardActionArea>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="baseline">
                        <Typography variant="h5" component="div" color={colors.grey[900]}>
                            {degreeName}
                        </Typography>
                        <Typography variant="subtitle1" component="div" color={colors.grey[600]}>
                            {degreeId}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="body1" color={colors.grey[700]}>
                            Total Students:
                        </Typography>
                        <Typography variant="h6" color={colors.blueAccent[500]}>
                            {totalStudents}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="body1" color={colors.grey[700]}>
                            Agent:
                        </Typography>
                        <Typography variant="body1" color={colors.grey[800]}>
                            {degreeAgent.firstName} {degreeAgent.lastName}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default DegreeCard;
