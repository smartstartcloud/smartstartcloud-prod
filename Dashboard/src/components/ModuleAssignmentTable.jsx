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
  useTheme,
} from "@mui/material";
import useGetOrderIdList from "../hooks/useGetOrderIdList";
import useSendAssignmentData from "../hooks/useSendAssignmentData";
import EditableTextField from "./EditableTextField";
import EditableTextFieldDynamic from "./EditableTextFieldDynamic";
import OrderAssignmentLink from "./OrderAssignmentLink";
import { format } from "date-fns";
import { tokens } from "../theme";

const ModuleAssignmentTable = ({studentData, assignmentReference}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { getOrderIdList } = useGetOrderIdList();
  const [orderIdLists, setOrderIdLists] = useState({}); // Object to store Order IDs for each moduleCode
  const [tableStatus, setTablestatus] = useState("orderID");
  const [assignmentOrderIdLists, setAssignmentOrderIdLists] = useState({}); // Object to store Order IDs for each moduleCode
  const [assignmentProgressStatusLists, setAssignmentProgressStatusLists] = useState({}); // Object to store Order IDs for each moduleCode
  const [assignmentGradeLists, setAssignmentGradeLists] = useState({}); // Object to store Order IDs for each moduleCode
  const [assignmentpaymentAmountLists, setAssignmentpaymentAmountLists] = useState({}); // Object to store Order IDs for each moduleCode
  const [orderConnectModuleOpen, setOrderConnectModuleOpen] = useState(false);
  const [assignmentList, setAssignmentList] = useState({});
  
  // Function to fetch Order IDs for a given moduleCode
  const fetchOrderIdList = async (referenceNumber) => {
    if (!referenceNumber) return;
    try {
      const data = await getOrderIdList(referenceNumber); // Call the API                        
      setOrderIdLists((prev) => {
        return ({
        ...prev,
        [referenceNumber]: data.orders, // Store the result in the state, keyed by moduleCode
      })});
    } catch (error) {
      console.error("Error fetching order list:", error);
    }
  };
  // Fetch Order IDs when the component mounts or when studentData changes

  const fetchAssignmentList = (referenceNumber, assignment) => {
    setAssignmentList((prev) => ({
      ...prev,
      [referenceNumber]: prev[referenceNumber] ? [...prev[referenceNumber], assignment] : [assignment], 
    }));
  }

  useEffect(() => {
    if (assignmentReference) {
      fetchOrderIdList(assignmentReference);
    }
  }, [assignmentReference]);

  useEffect(() => {
    setAssignmentList({})
    studentData.forEach((student) => {
      student.assignmentList.forEach((assignment) => {
        fetchAssignmentList(assignment.referenceNumber, assignment);
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
      // console.log(
      //   `Assignment ID: ${assignmentId}, Selected Value: ${newValue}`
      // );
      // console.log("Response Data:", response);
      // console.log("Current orderIdLists:", orderIdLists);
      // console.log(tableStatus, response, response.success);
      
      if (tableStatus === "orderID" && response) {
        setOrderIdLists((prev) => {
          const list = Array.isArray(prev[assignmentReference])
            ? prev[assignmentReference]
            : [];
          const nextVal = (newValue ?? "").toString().trim(); // treat null/undefined as ""
          const prevOrderID = response?.previousOrderID || "";
          const newOrderID = response?.newOrder?.orderID || nextVal;

          let updated = list;

          if (nextVal === "") {            
            // CLEAR CASE: unmark only the previously linked order if we know it; otherwise leave as-is
            updated = list.map((o) => 
              prevOrderID && o.orderID === prevOrderID
              ? { ...o, linkStatus: false }
              : o
            );
            console.log('updated', updated, list);
            
          } else {
            // ASSIGN/REASSIGN CASE:
            updated = list.map((o) => {
              if (o.orderID === newOrderID) return { ...o, linkStatus: true }; // mark new
              if (prevOrderID && o.orderID === prevOrderID)
                return { ...o, linkStatus: false }; // unmark old
              return o;
            });

            // If the chosen orderID isn't in the local list, append it so UI reflects backend truth
            if (!updated.some((o) => o.orderID === newOrderID)) {
              updated = [
                ...updated,
                {
                  orderID: newOrderID,
                  // include any fields your UI expects for an order row:
                  referenceNumber: assignmentReference,
                  linkStatus: true,
                },
              ];
            }
          }

          const nextState = { ...prev, [assignmentReference]: updated };
          console.log("Updated orderIdLists:", nextState);
          return nextState;
        });
      }
    } catch (e) {
      console.log("Error submitting orderID: ", e.message);
    }

    // Call your function here, for example:
    // updateAssignmentStatus(assignmentId, newValue);
  };

  const handleGroupButtonClick = (tableStatus) => {
    setTablestatus(tableStatus);
    if (tableStatus !== "orderID") {
      setOrderConnectModuleOpen(false);
    }
  }

  const handleOrderConnectModuleButton = () => {    
    setOrderConnectModuleOpen((prev) => !prev);
  }
  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        sm={tableStatus === "orderID" ? 6 : 12}
        gap={2}
        display="flex"
      >
        <Button
          onClick={() => handleGroupButtonClick("orderID")}
          color="secondary"
          variant="contained" // or "outlined" based on your styling preference
        >
          Order ID
        </Button>
        <Button
          onClick={() => handleGroupButtonClick("progress")}
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
          onClick={() => handleGroupButtonClick("grade")}
          color="secondary"
          variant="contained" // or "outlined" based on your styling preference
        >
          Grade
        </Button>
      </Grid>
      {/* {tableStatus === "orderID" ? (
        <Grid
          item
          xs={12}
          sm={6}
          gap={2}
          display="flex"
          justifyContent={"flex-end"}
        >
          <Button
            onClick={handleOrderConnectModuleButton}
            color="secondary"
            variant="contained" // or "outlined" based on your styling preference
          >
            Order Connect
          </Button>
        </Grid>
      ) : null} */}
      {orderConnectModuleOpen && (
        <Grid item xs={12}>
          <OrderAssignmentLink
            orderIdLists={orderIdLists}
            assignmentList={assignmentList}
            assignmentReference={assignmentReference}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">--- Cloud Student ID</TableCell>
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
                        ? format(
                            row.assignmentList[0].assignmentDeadline,
                            "dd/MM/yyyy"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.assignmentList.length > 0
                        ? row.assignmentList[0].referenceNumber
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.assignmentList.length > 0 ? (
                        <>
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
                              ).map((order) => (
                                <MenuItem key={order._id} value={order.orderID} disabled={order.linkStatus}
                                 sx={{backgroundColor: order.linkStatus ? colors.redAccent[700] : ''}}>
                                  {order.orderID}
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
                              <MenuItem value="FILE READY TO UPLOAD">
                                FILE READY TO UPLOAD
                              </MenuItem>
                              <MenuItem value="FILE UPLOADED">
                                FILE UPLOADED
                              </MenuItem>
                              <MenuItem value="WAITING TO BE GRADED">
                                WAITING TO BE GRADED
                              </MenuItem>
                              <MenuItem value="PASSED">PASSED</MenuItem>
                              <MenuItem value="FAILED">FAILED</MenuItem>
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
                        </>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                  {row.assignmentList
                    .slice(1)
                    .map((assignment, assignmentIndex) => (
                      <TableRow key={assignmentIndex}>
                        <TableCell>{assignment.assignmentName}</TableCell>
                        <TableCell>{assignment.assignmentType}</TableCell>
                        <TableCell>
                          {format(assignment.assignmentDeadline, "dd/MM/yyyy")}
                        </TableCell>
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
                              <MenuItem value="FILE READY TO UPLOAD">
                                FILE READY TO UPLOAD
                              </MenuItem>
                              <MenuItem value="FILE UPLOADED">
                                FILE UPLOADED
                              </MenuItem>
                              <MenuItem value="WAITING TO BE GRADED">
                                WAITING TO BE GRADED
                              </MenuItem>
                              <MenuItem value="PASSED">PASSED</MenuItem>
                              <MenuItem value="FAILED">FAILED</MenuItem>
                            </Select>
                          )}
                          {/* {tableStatus === "paymentAmount" && (
                            <EditableTextFieldDynamic
                              assignment={assignment}
                              assignmentDataLists={assignmentpaymentAmountLists}
                              handleDropdownChange={handleDropdownChange}
                              label={"Payment Amount"}
                            />
                          )} */}
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
