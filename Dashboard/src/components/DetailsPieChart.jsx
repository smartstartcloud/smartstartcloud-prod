import { Box, useTheme } from '@mui/material';
import React from 'react'
import { tokens } from '../theme';

const DetailsPieChart = ({data}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    console.log(data);
    
    
    return (
      <Box
        sx={{
          p: 2,
          backgroundColor: colors.blueAccent[800],
          borderRadius: 2,
          height: "200px"
        }}
      >
        {data}
      </Box>
    );
}

export default DetailsPieChart