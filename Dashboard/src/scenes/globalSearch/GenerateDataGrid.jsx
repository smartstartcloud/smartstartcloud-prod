import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";

const GenerateDataGrid = ({title, data}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // Helper function to generate columns dynamically based on data keys
    const generateColumns = (dataArray) => {
        if (!dataArray || dataArray.length === 0) return [];
        const keys = Object.keys(dataArray[0]);
        return keys.map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        flex: 1,
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