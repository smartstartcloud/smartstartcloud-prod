import { useTheme } from "@mui/material"
import { ResponsiveBar } from "@nivo/bar"
import { tokens } from "../theme"
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";
const BarChart = ({data}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Calculate the min and max payment values dynamically
  const [minPayment, maxPayment] = extent(data, (d) => d.payment);

  // Create a color scale with dynamic domain
  const colorScale = scaleLinear()
    .domain([minPayment, maxPayment]) // Dynamic range based on data
    .range(["#db4f4a", "#4cceac"]); // Red to Green gradient

  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
              fontSize: 9, // Set the font size of the tick labels
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["paidAmount"]}
      indexBy="label"
      margin={{ top: 20, right: 50, bottom: 60, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={(bar) => colorScale(bar.data.payment)} // Custom color function
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 15,
        legend: "module",
        legendPosition: "middle",
        legendOffset: 40,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "payment",
        legendPosition: "middle",
        legendOffset: -40,
        truncateTickAt: 0,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
    />
  );
}

export default BarChart