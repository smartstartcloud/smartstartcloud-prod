import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const CustomToolbar = ({ fromDate, toDate, onDateFilterChange }) => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ ml: 2, display: "flex", gap: 2, my: 2 }}>
          <DatePicker
            label="From"
            format="dd/MM/yyyy" // Custom date format
            value={fromDate ?? null} // explicitly fallback to null
            onChange={(newValue) => onDateFilterChange("from", newValue)}
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            label="To"
            format="dd/MM/yyyy" // Custom date format
            value={toDate ?? null}
            onChange={(newValue) => onDateFilterChange("to", newValue)}
            slotProps={{ textField: { size: "small" } }}
          />
        </Box>
      </LocalizationProvider>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
