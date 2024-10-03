import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  Tooltip,
  LinearProgress,
} from '@mui/material';

const AssignmentList = ({ list }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('orderID');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredList = list.filter((assignment) =>
    assignment.assignmentName && assignment.assignmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedList = filteredList.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    }
    return a[orderBy] > b[orderBy] ? -1 : 1;
  });

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Order ID', 'Assignment Name', 'Assignment Type', 'Deadline', 'Progress', 'Payment'],
      ...sortedList.map(assignment => [
        assignment.orderID,
        assignment.assignmentName,
        assignment.assignmentType,
        assignment.assignmentDeadline,
        assignment.assignmentProgress,
        assignment.assignmentPayment,
      ])
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'assignments.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTooltipContent = (assignment) => {
    return (
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          p: 2,
          borderRadius: 1,
          boxShadow: 3,
          width: 250,
        }}
      >
        <LinearProgress 
          variant="determinate" 
          value={assignment.assignmentProgress} 
          sx={{
            height: 10,
            borderRadius: 5,
            '& .MuiLinearProgress-bar': {
              backgroundColor: assignment.assignmentProgress > 75 
                ? '#76c7c0' 
                : assignment.assignmentProgress > 50 
                ? '#ffcc00' 
                : '#ff5733'
            },
          }} 
        />
      </Box>
    );
  };

  return (
    <Box>
      {list && (
        <Box mt={3} width="100%">
          <TextField
            label="Search Assignments"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ mb: 2 }}
            
          />
          <Button variant="contained" color="primary" onClick={handleDownloadCSV} sx={{ mb: 2 }}>
            Download CSV
          </Button>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'orderID'}
                      direction={orderBy === 'orderID' ? order : 'asc'}
                      onClick={() => handleRequestSort('orderID')}
                    >
                      Order ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'assignmentName'}
                      direction={orderBy === 'assignmentName' ? order : 'asc'}
                      onClick={() => handleRequestSort('assignmentName')}
                    >
                      Assignment Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'assignmentType'}
                      direction={orderBy === 'assignmentType' ? order : 'asc'}
                      onClick={() => handleRequestSort('assignmentType')}
                    >
                      Assignment Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'assignmentDeadline'}
                      direction={orderBy === 'assignmentDeadline' ? order : 'asc'}
                      onClick={() => handleRequestSort('assignmentDeadline')}
                    >
                      Deadline
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'assignmentProgress'}
                      direction={orderBy === 'assignmentProgress' ? order : 'asc'}
                      onClick={() => handleRequestSort('assignmentProgress')}
                    >
                      Progress
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'assignmentPayment'}
                      direction={orderBy === 'assignmentPayment' ? order : 'asc'}
                      onClick={() => handleRequestSort('assignmentPayment')}
                    >
                      Payment Status
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((assignment) => (
                  <TableRow key={assignment.orderID}>
                    {['orderID', 'assignmentName', 'assignmentType', 'assignmentDeadline', 'assignmentProgress', 'assignmentPayment'].map((key) => (
                      <TableCell key={key}>
                        <Tooltip
                          title={renderTooltipContent(assignment)}
                          arrow
                          interactive
                        >
                          <span>{assignment[key]}</span>
                        </Tooltip>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sortedList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </Box>
  );
};

export default AssignmentList;
