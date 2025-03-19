import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const CustomDataToolbar = ({ onRefresh }) => {
  return (
    <GridToolbarContainer>
      {/* Default Export Button */}
      <GridToolbarExport />

      {/* Default Columns Button */}
      <GridToolbarColumnsButton />

      {/* Default Filter Button */}
      <GridToolbarFilterButton />

      {/* Custom Refresh Button */}
      {/* <Button
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
        variant="contained"
        color="primary"
        sx={{ marginLeft: 1 }}
      >
        Refresh
      </Button> */}
    </GridToolbarContainer>
  );
};

export default CustomDataToolbar;
