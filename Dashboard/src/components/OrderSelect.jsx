import React, { useEffect, useState } from "react";
import {
  Grid,
  MenuItem,
  Select,
  TextField,
  Button,
  InputLabel,
  FormControl,
  FormHelperText,
  useTheme,
} from "@mui/material";
import { Controller } from "react-hook-form";
import useGetOrderIdList from "../hooks/useGetOrderIdList";
import { tokens } from "../theme";

const OrderSelect = ({ control, editMode }) => {  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [refNo, setRefNo] = useState("");  
  const [orderIdDetails, setOrderIdDetails] = useState([]);
  const [selectError, setSelectError] = useState(false);
 
  // useEffect(() => {
  //   console.log(refNo);
    
  // }, [refNo]);

  const { getOrderIdList } = useGetOrderIdList();

  const handleFetchOrderIds = async (e) => {   
    console.log("e", e);
     
    try {
      if (!e || typeof e !== "string" || e.trim() === "") {
        throw new Error("Invalid reference number (refNo)");
      }
      setRefNo(e)
      const response = await getOrderIdList(e);
      
      setOrderIdDetails(response.orders);
      setSelectError(false); // Clear error when order IDs are fetched
    } catch (error) {
      console.error("Error fetching order IDs:", error);
    }
  };

  const handleSelectClick = () => {    
    if (!refNo) {
      setSelectError(true);
    }
  };

  return (
    <Grid item xs={12} sm={12}>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Controller
            name="referenceNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ref No"
                variant="outlined"
                fullWidth
                required
                onBlur={(e) => {
                  field.onBlur(e)
                  handleFetchOrderIds(e.target.value); // Call your function
                }}
                onChange={(e) => {
                  field.onChange(e); // Call RHF's onChange
                  setRefNo(e.target.value);
                  setSelectError(false); // Clear error on reference number change
                }}
                sx={{ mb: 2 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="orderID"
            control={control}
            render={({ field }) => (
              <FormControl 
                fullWidth 
                variant="outlined" 
                sx={{ mb: 2 }}
                error={selectError}
              >
                <InputLabel>Select Order ID</InputLabel>
                <Select
                  {...field}
                  label="Select Order ID"
                  variant="outlined"
                  fullWidth
                  displayEmpty
                  disabled={orderIdDetails.length === 0} // Disable when no refNo
                  onClick={handleSelectClick} // Show error when clicked without refNo
                >
                  {orderIdDetails.length === 0 ? (
                    <MenuItem value="" disabled>
                      
                    </MenuItem>
                  ) : (
                    orderIdDetails.map((order) => (
                      <MenuItem key={order._id} value={order.orderID} disabled={order.linkStatus}
                        sx={{backgroundColor: order.linkStatus ? colors.redAccent[700] : ''}}>
                        {order.orderID}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {selectError && (
                  <FormHelperText>
                    Please enter a reference number first to select an order ID.
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OrderSelect;
