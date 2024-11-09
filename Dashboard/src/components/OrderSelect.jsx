import React, { useState } from "react";
import {
  Grid,
  MenuItem,
  Select,
  TextField,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Controller } from "react-hook-form";
import useGetOrderIdList from "../hooks/useGetOrderIdList";

const OrderSelect = ({ control, editMode }) => {
  const [refNo, setRefNo] = useState(""); // RefNo input field state
  const [orderIds, setOrderIds] = useState([]); // Order IDs list state

  const {getOrderIdList} = useGetOrderIdList()

  // Function to handle API call and populate the select dropdown
  const handleFetchOrderIds = async () => {
    try {        
      // Make an API call to fetch order IDs by refNo
      const response = await getOrderIdList(refNo);
      setOrderIds(response.orderIDs); // Update order IDs based on API response

    } catch (error) {
      console.error("Error fetching order IDs:", error);
    }
  };

  return (
    <Grid item xs={12} sm={12}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {/* Select dropdown for order IDs */}
          <Controller
            name="orderID"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Select Order ID</InputLabel>
                <Select
                  {...field}
                  label="Select Order ID"
                  variant="outlined"
                  fullWidth
                  displayEmpty
                  disabled={orderIds.length === 0} // Disable if no order IDs or editMode is true
                >
                  {orderIds.length === 0 ? (
                    <MenuItem value="" disabled>
                      No Order IDs available
                    </MenuItem>
                  ) : (
                    orderIds.map((orderID, index) => (
                      <MenuItem key={index} value={orderID}>
                        {orderID}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          {/* RefNo input field */}
          <TextField
            label="Reference Number"
            variant="outlined"
            fullWidth
            value={refNo}
            onBlur={handleFetchOrderIds} // Call handleBlur on losing focus
            onChange={(e) => setRefNo(e.target.value)} // Update refNo state on change
            // disabled={editMode}
            sx={{ mb: 2 }}
          />
        </Grid>
        {/* <Grid item xs={12} sm={2}>
          {/* Button to fetch order IDs
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFetchOrderIds}
            onBlur={handleBlur} // Call handleBlur on losing focus
            disabled={!refNo} // Disable button if editMode is true or refNo is empty
            sx={{ mb: 2 }}
          >
            Fetch
          </Button>
        </Grid> */}
      </Grid>
    </Grid>
  );
};

export default OrderSelect;
