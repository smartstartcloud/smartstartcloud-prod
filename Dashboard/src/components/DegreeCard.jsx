import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useTheme } from '@emotion/react';
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

const DegreeCard = ({degreeYear, degreeId, degreeName, totalStudents, degreeAgent}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/task/${degreeYear}/${degreeId}`);
  };
  return (
    <Card onClick={handleClick} sx={{minWidth: '500px', background: colors.grey[300] }} >
      <CardActionArea>
        <CardContent>
          <Box display='flex' justifyContent='space-between' alignItems='baseline' >
            <Typography mr={5} variant="h3" component="div" color={colors.grey[900]}>
              {degreeName}
            </Typography>
            <Typography textAlign='right' variant="h6" component="div" color={colors.grey[900]}>
              {degreeId}
            </Typography>
          </Box>
          <Box display='flex' justifyContent='space-between' alignItems='baseline' >
            <Typography my={2} variant="h5" color={colors.grey[900]}>
              Total number of Students:
            </Typography>
            <Typography textAlign='right' my={2} variant="h4" color={colors.grey[900]}>
              {totalStudents}
            </Typography>
          </Box>
          
          <Box display='flex' justifyContent='space-between' alignItems='baseline'>
            <Typography variant="h5" color={colors.grey[900]}>
              Agent:
            </Typography>
            <Typography textAlign='right' variant="h5" color={colors.grey[900]}>
              {degreeAgent}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default DegreeCard