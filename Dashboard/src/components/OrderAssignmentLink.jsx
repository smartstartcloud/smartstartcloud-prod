import { Box, Button, Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import useSendAssignmentOrderIDList from "../hooks/useSendAssignmentOrderIDList";

const OrderAssignmentLink = ({orderIdLists, assignmentList, assignmentReference}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [assignmentOrderPairs, setAssignmentOrderPairs] = useState([]);
    const {sendAssignmentOrderIDList} = useSendAssignmentOrderIDList()

    // useEffect(() => {
    //     console.log(orderIdLists, assignmentList, assignmentReference);
    //   }, [orderIdLists, assignmentList]);

    const handleOrderConnect = () => {
        const newArray = assignmentList[assignmentReference].map((row, index) => ({
            assignmentID: row._id || "",
            orderID: orderIdLists[assignmentReference][index] || "",
          }));
        setAssignmentOrderPairs(newArray);
        handleSubmit(newArray)
    }

    const handleSubmit = async (newArray) => {        
        try{
          const response = await sendAssignmentOrderIDList(newArray);
          console.log("Response Data:", response);
        }catch (e) {
            console.log("Error linking: ", e.message)
        }
      };

  return (
    <Box m="20px auto" display="flex" flexDirection="column" maxWidth="1000px">
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            mb={2}
            >
            <Card
            sx={{
                width: "100%",
                p: 2,
                background: `linear-gradient(145deg, ${colors.greenAccent[700]}, ${colors.greenAccent[500]})`,
                boxShadow: 6,
                borderRadius: 4,
            }}
            >
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="h3"
                                color={colors.grey[100]}
                                sx={{ fontWeight: "bold", mb: 2 }}
                            >
                                Order Assignment Link
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} display={"flex"} justifyContent={"flex-end"}>
                        <Button
                            onClick={handleOrderConnect}
                            color="primary"
                            variant="contained" // or "outlined" based on your styling preference
                        >
                            Order Connect
                        </Button>
                        </Grid>
                    </Grid>
                </CardContent>
                <TableContainer component={Paper}  sx={{maxHeight: "400px", overflowY: "auto"}}>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{fontWeight: "bold"}}>Index</TableCell>
                            <TableCell align="left" sx={{fontWeight: "bold"}}>Assignment Name</TableCell>
                            <TableCell align="left" sx={{fontWeight: "bold"}}>Order ID</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {assignmentList[assignmentReference].map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {index}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: row._id ? "inherit" : "red",
                                            fontWeight: row._id ? "normal" : "bold",
                                        }}
                                    >
                                        {row.assignmentID || "No Assignment Name"}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: orderIdLists[assignmentReference][index] ? "inherit" : "red",
                                            fontWeight: orderIdLists[assignmentReference][index] ? "normal" : "bold",
                                        }}
                                    >
                                        {orderIdLists[assignmentReference][index] || "No OrderID"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    </Box>
  );
};

export default OrderAssignmentLink;
