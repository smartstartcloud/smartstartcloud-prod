import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  TextField,
  Button,
  useTheme,
  Typography,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import useFetchSelectedDegreeData from "../../hooks/useFetchSelectedDegreeData";
import useGlobalSearch from "../../hooks/useGlobalSearch";
import GenerateDataGrid from "./GenerateDataGrid";

const GlobalSearch = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState('');

    const { results, loading, error } = useGlobalSearch(searchResult);
    
    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            setIsSearching(false);
            return;
        }
        setIsSearching(true);        
        setSearchResult(searchTerm)
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const resetSearch = () => {
        setSearchTerm("");
        setIsSearching(false);
        setSearchResult('');
    };

    if (loading) {
        return (
            <Box mt="200px" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={100} sx={{ color: colors.blueAccent[100] }} />
            </Box>
        );
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    return (
      <Box m="20px">
        <Header title={`Search`} subtitle="Here are all the search results" />

        <Box mt={3} display="flex" flexDirection="column" alignItems="center">
          <Box
            display="flex"
            width="100%"
            maxWidth="600px"
            gap={2}
            alignItems="center"
          >
            <TextField
              label="Search All"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter key press
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {isSearching && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={resetSearch}
                sx={{ minWidth: "120px" }}
              >
                Reset
              </Button>
            )}
          </Box>
        </Box>

        {isSearching && (
          <Box mt={2}>
            <Typography variant="subtitle1" color={colors.blueAccent[500]}>
              Showing search result for: <strong>{searchTerm}</strong>
            </Typography>
          </Box>
        )}
        {results && (
          <Box p={2}>
            {results.users && (
              <GenerateDataGrid title={"Users"} data={results.users} />
            )}
            {results.degrees && (
              <GenerateDataGrid title={"Degrees"} data={results.degrees} />
            )}
            {results.modules && (
              <GenerateDataGrid title={"Modules"} data={results.modules} />
            )}
            {results.assignments && (
              <GenerateDataGrid
                title={"Assignments"}
                data={results.assignments}
              />
            )}
            {results.students && (
              <GenerateDataGrid title={"Students"} data={results.students} />
            )}
            {results.orders && (
              <GenerateDataGrid title={"Orders"} data={results.orders} />
            )}
            {results.files && (
              <GenerateDataGrid title={"Files"} data={results.files} />
            )}
            {results.payments && (
              <GenerateDataGrid title={"Payments"} data={results.payments} />
            )}
          </Box>
        )}
      </Box>
    );
};

export default GlobalSearch;
