import { Box, Typography, useTheme } from '@mui/material';
import React from 'react'
import { tokens } from '../theme';
import { ResponsivePie } from "@nivo/pie";

const DetailsPieChart = ({ data, headLine}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // console.log(data);
  // Create an object to store counts
  // Get unique IDs and count occurrences
  const uniqueIds = [...new Set(data)];
  const resultSet = new Set(
    uniqueIds.map((id) =>
      JSON.stringify({
        id: id,
        value: data.filter((item) => item === id).length, // Count occurrences
      })
    )
  );
  const resultArray = Array.from(resultSet).map((item) => JSON.parse(item));

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: colors.blueAccent[800],
        borderRadius: 2,
        height: "320px",
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" color={colors.grey[200]}>
          <strong>{headLine}</strong>
        </Typography>
      </Box>
      <ResponsivePie
        data={resultArray}
        margin={{ top: 40, right: 0, bottom: 50, left: -100 }}
        innerRadius={0.5}
        cornerRadius={1}
        activeOuterRadiusOffset={5}
        colors={{ scheme: "nivo" }}
        borderWidth={1}
        borderColor="black"
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        // legends={[
        //   {
        //     anchor: "right",
        //     direction: "column",
        //     justify: false,
        //     translateX: 6,
        //     translateY: 0,
        //     itemsSpacing: 0,
        //     itemWidth: 150,
        //     itemHeight: 18,
        //     itemTextColor: "#999",
        //     itemDirection: "left-to-right",
        //     itemOpacity: 1,
        //     symbolSize: 10,
        //     symbolShape: "circle",
        //     effects: [
        //       {
        //         on: "hover",
        //         style: {
        //           itemTextColor: "#000",
        //         },
        //       },
        //     ],
        //   },
        // ]}
      />
    </Box>
  );
};

export default DetailsPieChart