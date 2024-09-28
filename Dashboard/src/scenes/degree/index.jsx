import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Grid, TextField, Button, useTheme, Typography, InputAdornment, IconButton, List, ListItem, ListItemText, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Header from '../../components/Header';
import { degreeFilter } from '../../utils/yearFilter';
import DegreeCard from '../../components/DegreeCard';
import { tokens } from '../../theme';
import useFetchSelectedDegreeData from '../../hooks/useFetchSelectedDegreeData';

const DegreeBoard = () => {
    const { degreeYear } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { degree, loading, error } = useFetchSelectedDegreeData(degreeYear);
    const { filteredDegree, yearName } = degree ? degreeFilter(degree, degreeYear) : {};

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setIsSearching(false);
            return;
        }
        const result = filteredDegree.filter(degree =>
            degree.degreeName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResult(result);
        setIsSearching(true);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setSuggestions([]);
            return;
        }

        const filteredSuggestions = filteredDegree.filter(degree =>
            degree.degreeName.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions.slice(0, 5)); // Show top 5 suggestions
    };

    const handleSuggestionClick = (degreeName) => {
        setSearchTerm(degreeName);
        handleSearch();
        setSuggestions([]);
    };

    const resetSearch = () => {
        setSearchTerm('');
        setIsSearching(false);
        setSearchResult([]);
        setSuggestions([]);
    };

    // Handle loading and error states
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

    const displayDegrees = isSearching ? searchResult : filteredDegree;

    return (
        <Box m="20px">
            <Header title={`All degrees of ${yearName}`} subtitle="Here is all the information listed in your Assignment" />

            {/* Search Bar */}
            <Box mt={3} display="flex" flexDirection="column" alignItems="center">
                <Box display="flex" width="100%" maxWidth="600px" gap={2} alignItems="center">
                    <TextField
                        label="Search Degree"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}  // Trigger search on Enter key press
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    {isSearching && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={resetSearch}
                            sx={{ minWidth: '120px' }}
                        >
                            Reset
                        </Button>
                    )}
                </Box>

                {/* Search Suggestions */}
                {suggestions.length > 0 && (
                    <Paper elevation={3} sx={{ width: '100%', maxWidth: '600px', mt: 1 }}>
                        <List>
                            {suggestions.map((suggestion) => (
                                <ListItem
                                    button
                                    key={suggestion.degreeID}
                                    onClick={() => handleSuggestionClick(suggestion.degreeName)}
                                >
                                    <ListItemText primary={suggestion.degreeName} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>

            {/* Display Search Result Info */}
            {isSearching && (
                <Box mt={2}>
                    <Typography variant="subtitle1" color={colors.blueAccent[500]}>
                        Showing search result for: <strong>{searchTerm}</strong>
                    </Typography>
                </Box>
            )}

            {/* Degree Cards */}
            <Box mt={4}>
                <Grid container spacing={3} justifyContent="center">
                    {displayDegrees.length > 0 ? (
                        displayDegrees.map((degree) => (
                            <Grid item xs={12} sm={6} md={4} key={degree.degreeID}>
                                <DegreeCard
                                    degreeYear={degreeYear}
                                    degreeId={degree.degreeID}
                                    degreeName={degree.degreeName}
                                    totalStudents={degree.degreeStudentList.length}
                                    degreeAgent={degree.degreeAgent}
                                />
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="h6" color={colors.redAccent[500]}>
                            No degrees found for "{searchTerm}".
                        </Typography>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default DegreeBoard;
