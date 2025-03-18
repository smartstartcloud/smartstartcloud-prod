import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { formatDateString } from "../../utils/yearFilter.js";
import { enumToString, formatDate } from "../../utils/functions.js";
import { format } from "date-fns";

const GenerateDataGrid = ({title, data}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // Helper function to generate columns dynamically based on data keys
    const generateColumns = (dataArray) => {
      if (!dataArray || dataArray.length === 0) return [];
      const excludeArray = [
        "_id",
        "metadata",
        "assignmentNature",
        "referenceCollection",
        "fileCategory",
      ]; // Add keys you want to exclude
      const yearFormatKey = ["degreeYear"];
      const dateFormatKey = ["totalPaymentToDate", "assignmentDeadline"];
      const enumToStringKey = [
        "assignmentProgress",
        "paymentPlan",
        "paymentMethod",
        "paymentVerificationStatus",
        "paymentStatus",
      ];
      const keys = Object.keys(dataArray[0]).filter(
        (key) => !excludeArray.includes(key)
      );
      keys.forEach((key) => {
        if (yearFormatKey.includes(key)){            
        }
      })
      return keys.map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        flex: 1,
        ...(yearFormatKey.includes(key) && {
          valueGetter: (params) => formatDateString(params),
        }), // Apply valueGetter conditionally
        ...(dateFormatKey.includes(key) && {
          valueGetter: (params) => formatDate(params),
        }), // Apply valueGetter conditionally
        ...(enumToStringKey.includes(key) && {
          valueGetter: (params) => enumToString(key, params),
        }), // Apply valueGetter conditionally
      }));
    };

    if (!data || data.length === 0) return null;
    const columns = generateColumns(data);

    return (
        <Box mb={4}>
        <Typography variant="h5" gutterBottom>
            {title}
        </Typography>
        <DataGrid
            sx={{
            "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[200],
                color: colors.black,
                fontSize: "16px",
            },
            "& .MuiDataGrid-row": {
                backgroundColor: colors.grey[50],
                color: colors.black,
                cursor: "pointer",
                "&:hover": {
                backgroundColor: colors.blueAccent[50],
                transform: "scale(1.01)",
                transition: "transform 0.2s",
                },
            },
            }}
            rows={data}
            columns={columns}
            getRowId={(row) => row._id || row.id || Math.random()}
            autoHeight
            slots={{ toolbar: GridToolbar }}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 10,
                page: 0, // Initial page index
                },
            },
            }}
            pageSizeOptions={[10, 20, 50, 100]}
        />
        </Box>
    );
}

export default GenerateDataGrid