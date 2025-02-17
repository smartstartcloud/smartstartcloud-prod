import { Box, IconButton, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react'
import { tokens } from '../theme';
import { ResponsiveBar } from '@nivo/bar';
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

const DetailsPieChart = ({ data, headLine, type}) => {
  const [onClickCollapse, setOnClickCollapse] = useState(false);
  const handleOnClickCollapse = () => {
    setOnClickCollapse(!onClickCollapse);
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let keys = []
  const refactorData = data.map((item) => {
    const module = item.moduleName;
    let count = 0
    let uniqueIds = [];
    if (type === "status") {
        uniqueIds = [...new Set(item.moduleProgress)];
    } else if (type === "grade") {
        uniqueIds = [...new Set(item.moduleGrade)];
    }
    keys.push(uniqueIds);
    const tempObj = {module}
    uniqueIds.forEach((id) => {
      if (type === "status") {
        count = item.moduleProgress.filter((item) => item === id).length;
      } else if (type === "grade") {
        count = item.moduleGrade.filter((item) => item === id).length;
      }
      tempObj[id] = count;
    });

    return tempObj;
  });
  keys = [...new Set(keys.flat())];  

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: colors.blueAccent[800],
        borderRadius: 2,
        height: "auto",
        transition: "height 0.3s ease", // Smooth transition for height change
      }}
    >
      <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color={colors.grey[200]}>
          <strong>{headLine}</strong>
        </Typography>
        <IconButton
          aria-label="delete"
          onClick={handleOnClickCollapse}
          sx={{ color: colors.grey[200], p: 0, transform: onClickCollapse ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s ease" }}
        >
          <ExpandCircleDownIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          height: onClickCollapse ? "0px" : "259px",
          width: "100%",
          transition: "height 0.3s ease", // Smooth transition for height change
        }}
      >
        <ResponsiveBar
          data={type !== "payment" ? refactorData : data}
          keys={type !== "payment" ? keys : ["moduleSum"]}
          indexBy={type !== "payment" ? "module" : "moduleName"}
          margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "ModuleName",
            legendPosition: "middle",
            legendOffset: 32,
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Number of assignments",
            legendPosition: "middle",
            legendOffset: -40,
            truncateTickAt: 0,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
        />
      </Box>
    </Box>
  );
};

export default DetailsPieChart