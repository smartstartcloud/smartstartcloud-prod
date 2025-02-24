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
  Grid,
  Button,
  TextField,
} from "@mui/material";
import useGetOrderIdList from "../hooks/useGetOrderIdList";
import useSendAssignmentData from "../hooks/useSendAssignmentData";
import EditableTextField from "./EditableTextField";
import EditableTextFieldDynamic from "./EditableTextFieldDynamic";

const ModuleAssignmentTable = ({studentData}) => {
  const { getOrderIdList } = useGetOrderIdList();
  const [orderIdLists, setOrderIdLists] = useState({}); // Object to store Order IDs for each moduleCode
  const [tableStatus, setTablestatus] = useState("orderID");
  const [assignmentOrderIdLists, setAssignmentOrderIdLists] = useState({}); // Object to store Order IDs for each moduleCode
  const [assignmentProgressStatusLists, setAssignmentProgressStatusLists] = useState({}); // Object to store Order IDs for each moduleCode
  const [assignmentGradeLists, setAssignmentGradeLists] = useState({}); // Object to store Order IDs for each moduleCode
  const [assignmentpaymentAmountLists, setAssignmentpaymentAmountLists] = useState({}); // Object to store Order IDs for each moduleCode  

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

  const { updateOrderID } = useSendAssignmentData();
  
  const handleDropdownChange = async (assignmentId, newValue) => {
    console.log(tableStatus, newValue);
    if (tableStatus === "orderID") {
      setAssignmentOrderIdLists((prev) => ({
        ...prev,
        [assignmentId]: newValue, // Store the result in the state, keyed by moduleCode
      }));
    } else if (tableStatus === "progress") {
      setAssignmentProgressStatusLists((prev) => ({
        ...prev,
        [assignmentId]: newValue, // Store the result in the state, keyed by moduleCode
      }));
    } else if (tableStatus === "paymentAmount") {
      setAssignmentpaymentAmountLists((prev) => ({
        ...prev,
        [assignmentId]: newValue, // Store the result in the state, keyed by moduleCode
      }));
    } else if (tableStatus === "grade") {
      setAssignmentGradeLists((prev) => ({
        ...prev,
        [assignmentId]: newValue, // Store the result in the state, keyed by moduleCode
      }));
    }
    
    // Perform your desired action here
    try {
      const response = await updateOrderID({
        assignmentID: assignmentId,
        newValue: newValue,
        tStatus: tableStatus,
      });
      console.log(
        `Assignment ID: ${assignmentId}, Selected Value: ${newValue}`
      );
      console.log("Response Data:", response);
    } catch (e) {
      console.log("Error submitting orderID: ", e.message);
    }

    // Call your function here, for example:
    // updateAssignmentStatus(assignmentId, newValue);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} gap={2} display="flex">
        <Button
          onClick={() => setTablestatus("orderID")}
          color="secondary"
          variant="contained" // or "outlined" based on your styling preference
        >
          Order ID
        </Button>
        <Button
          onClick={() => setTablestatus("progress")}
          color="secondary"
          variant="contained" // or "outlined" based on your styling preference
        >
          Progress
        </Button>
        {/* <Button
          onClick={() => setTablestatus("paymentAmount")}
          color="secondary"
          variant="contained" // or "outlined" based on your styling preference
        >
          Payment
        </Button> */}
        <Button
          onClick={() => setTablestatus("grade")}
          color="secondary"
          variant="contained" // or "outlined" based on your styling preference
        >
          Grade
        </Button>
      </Grid>
      <Grid item xs={12}>
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
                <TableCell align="left">
                  {tableStatus === "grade"
                    ? "Grade"
                    : tableStatus === "progress"
                    ? "Progress"
                    : tableStatus === "paymentAmount"
                    ? "Amount Paid"
                    : "Order ID"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentData.map((row, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell
                      rowSpan={
                        row.assignmentList.length > 0
                          ? row.assignmentList.length
                          : 1
                      }
                    >
                      {row.id}
                    </TableCell>
                    <TableCell
                      rowSpan={
                        row.assignmentList.length > 0
                          ? row.assignmentList.length
                          : 1
                      }
                      sx={{ fontSize: "14px" }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell>
                      {row.assignmentList.length > 0
                        ? row.assignmentList[0].assignmentName
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.assignmentList.length > 0
                        ? row.assignmentList[0].assignmentType
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.assignmentList.length > 0
                        ? row.assignmentList[0].assignmentDeadline
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.assignmentList.length > 0
                        ? row.assignmentList[0].referenceNumber
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.assignmentList.length > 0 ? <>
                        {tableStatus === "orderID" && (
                          <Select
                            value={
                              assignmentOrderIdLists[
                                row.assignmentList[0]._id
                              ] ||
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
                              orderIdLists[
                                row.assignmentList[0].referenceNumber
                              ] || []
                            ).map((orderId) => (
                              <MenuItem key={orderId} value={orderId}>
                                {orderId}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        {tableStatus === "progress" && (
                          <Select
                            value={
                              assignmentProgressStatusLists[
                                row.assignmentList[0]._id
                              ] ||
                              row.assignmentList[0].assignmentProgress || // Set initial value from orderID
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
                            <MenuItem value="TBA">TO BE ASSIGNED</MenuItem>
                            <MenuItem value="ORDER ID ASSIGNED">
                              ORDER ID ASSIGNED
                            </MenuItem>
                            <MenuItem value="FILE UPLOADED">
                              FILE UPLOADED
                            </MenuItem>
                            <MenuItem value="IN REVIEW">IN REVIEW</MenuItem>
                            <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                          </Select>
                        )}
                        {tableStatus === "paymentAmount" && (
                          <EditableTextField
                            row={row}
                            assignmentDataLists={assignmentpaymentAmountLists}
                            handleDropdownChange={handleDropdownChange}
                            dataType={row.assignmentList[0].assignmentPayment}
                            label={"Payment Amount"}
                          />
                        )}
                        {tableStatus === "grade" && (
                          <EditableTextField
                            row={row}
                            assignmentDataLists={assignmentpaymentAmountLists}
                            handleDropdownChange={handleDropdownChange}
                            dataType={row.assignmentList[0].assignmentGrade}
                            label={"Grades"}
                          />
                        )}
                      </> : "N/A"}
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
                          {tableStatus === "orderID" && (
                            <Select
                              value={
                                assignmentOrderIdLists[assignment._id] ||
                                assignment.orderID || // Set initial value from orderID
                                ""
                              }
                              onChange={(e) =>
                                handleDropdownChange(
                                  assignment._id,
                                  e.target.value
                                )
                              }
                              displayEmpty
                            >
                              <MenuItem value="">
                                <em>Select Order ID</em>
                              </MenuItem>
                              {(
                                orderIdLists[assignment.referenceNumber] || []
                              ).map((orderId) => (
                                <MenuItem key={orderId} value={orderId}>
                                  {orderId}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                          {tableStatus === "progress" && (
                            <Select
                              value={
                                assignmentProgressStatusLists[assignment._id] ||
                                assignment.assignmentProgress || // Set initial value from orderID
                                ""
                              }
                              onChange={(e) =>
                                handleDropdownChange(
                                  assignment._id,
                                  e.target.value
                                )
                              }
                              displayEmpty
                            >
                              <MenuItem value="TBA">TO BE ASSIGNED</MenuItem>
                              <MenuItem value="ORDER ID ASSIGNED">
                                ORDER ID ASSIGNED
                              </MenuItem>
                              <MenuItem value="FILE UPLOADED">
                                FILE UPLOADED
                              </MenuItem>
                              <MenuItem value="IN REVIEW">IN REVIEW</MenuItem>
                              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                            </Select>
                          )}
                          {tableStatus === "paymentAmount" && (
                            <EditableTextFieldDynamic
                              assignment={assignment}
                              assignmentDataLists={assignmentpaymentAmountLists}
                              handleDropdownChange={handleDropdownChange}
                              label={"Payment Amount"}
                            />
                          )}
                          {tableStatus === "grade" && (
                            <EditableTextFieldDynamic
                              assignment={assignment}
                              assignmentDataLists={assignmentGradeLists}
                              handleDropdownChange={handleDropdownChange}
                              dataType={assignment.assignmentGrade}
                              label={"Grades"}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default ModuleAssignmentTable;
