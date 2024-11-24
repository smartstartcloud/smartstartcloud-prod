import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
  MenuItem,
  Select,
} from "@mui/material";
import useGetOrderIdList from "../hooks/useGetOrderIdList";
import useSendAssignmentData from "../hooks/useSendAssignmentData";

const ModuleAssignmentTable = ({studentData}) => {    
  const { getOrderIdList } = useGetOrderIdList();
  const [orderIdLists, setOrderIdLists] = useState({}); // Object to store Order IDs for each moduleCode
  const [assignmentOrderIdLists, setAssignmentOrderIdLists] = useState({}); // Object to store Order IDs for each moduleCode  
  // Function to fetch Order IDs for a given moduleCode
  const fetchOrderIdList = async (referenceNumber) => {
    if (!referenceNumber) return;
    try {
      const data = await getOrderIdList(referenceNumber); // Call the API
      setOrderIdLists((prev) => ({
        ...prev,
        [referenceNumber]: data.orderIDs, // Store the result in the state, keyed by moduleCode
      }));
    } catch (error) {
      console.error("Error fetching order list:", error);
    }
  };
  // Fetch Order IDs when the component mounts or when studentData changes
  useEffect(() => {
    studentData.forEach((student) => {
      student.assignmentList.forEach((assignment) => {
        fetchOrderIdList(assignment.referenceNumber);
      });
    });
  }, [studentData]);

  const { updateOrderID } = useSendAssignmentData()
  const handleDropdownChange = async (assignmentId, newValue) => {
    setAssignmentOrderIdLists((prev) => ({
      ...prev,
      [assignmentId]: newValue, // Store the result in the state, keyed by moduleCode
    }));    
    // Perform your desired action here
    try {
        const response = await updateOrderID({ assignmentID: assignmentId, orderID: newValue });
        console.log(`Assignment ID: ${assignmentId}, Selected Value: ${newValue}`);
        console.log("Response Data:", response);
    } catch (e) {
        console.log("Error submitting orderID: ", e.message);
    }

    // Call your function here, for example:
    // updateAssignmentStatus(assignmentId, newValue);
  };
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Student ID</TableCell>
            <TableCell align="left">Student Name</TableCell>
            <TableCell align="left">Assignment Name</TableCell>
            <TableCell align="left">Assignment Type</TableCell>
            <TableCell align="left">Assignment Deadline</TableCell>
            <TableCell align="left">Reference Number</TableCell>
            <TableCell align="left">Order ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studentData.map((row, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell rowSpan={row.assignmentList.length}>
                  {row.id}
                </TableCell>
                <TableCell rowSpan={row.assignmentList.length}>
                  {row.name}
                </TableCell>
                <TableCell>{row.assignmentList[0].assignmentName}</TableCell>
                <TableCell>{row.assignmentList[0].assignmentType}</TableCell>
                <TableCell>
                  {row.assignmentList[0].assignmentDeadline}
                </TableCell>
                <TableCell>{row.assignmentList[0].referenceNumber}</TableCell>
                <TableCell>
                  <Select
                    value={
                      assignmentOrderIdLists[row.assignmentList[0]._id] ||
                      row.assignmentList[0].orderID || // Set initial value from orderID
                      ""
                    }
                    onChange={(e) =>
                      handleDropdownChange(
                        row.assignmentList[0]._id,
                        e.target.value
                      )
                    }
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Order ID</em>
                    </MenuItem>
                    {(
                      orderIdLists[row.assignmentList[0].referenceNumber] || []
                    ).map((orderId) => (
                      <MenuItem key={orderId} value={orderId}>
                        {orderId}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
              {row.assignmentList
                .slice(1)
                .map((assignment, assignmentIndex) => (
                  <TableRow key={assignmentIndex}>
                    <TableCell>{assignment.assignmentName}</TableCell>
                    <TableCell>{assignment.assignmentType}</TableCell>
                    <TableCell>{assignment.assignmentDeadline}</TableCell>
                    <TableCell>{assignment.referenceNumber}</TableCell>
                    <TableCell>
                      <Select
                        value={
                          assignmentOrderIdLists[assignment._id] ||
                          assignment.orderID || // Set initial value from orderID
                          ""
                        }
                        onChange={(e) =>
                          handleDropdownChange(assignment._id, e.target.value)
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select Order ID</em>
                        </MenuItem>
                        {(orderIdLists[assignment.referenceNumber] || []).map(
                          (orderId) => (
                            <MenuItem key={orderId} value={orderId}>
                              {orderId}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ModuleAssignmentTable;
