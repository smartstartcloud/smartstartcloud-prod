import { Box, Card, CardActionArea, CardContent, Typography, useTheme, Divider } from '@mui/material';
import React from 'react';
import { tokens } from '../../theme';

const OrderCard = ({ orderID, referenceNumber, handleIDClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Card
      onClick={() => handleIDClick(orderID)}
      sx={{
        minWidth: "250px", // Increased minimum width
        maxWidth: "400px", // Optional: Limit maximum width
        background: `linear-gradient(210deg, ${colors.blueAccent[800]}, ${colors.blueAccent[900]})`,
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 22px rgba(0,0,0,0.2)",
        },
        color: colors.grey[50],
        p: 1,
      }}
    >
      <CardActionArea>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="baseline"
            mb={1}
          >
            <Typography variant="h6" component="div">
              Order ID
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontWeight: "bold", maxWidth: "80%", wordWrap: "break-word" }}
            >
              {orderID}
            </Typography>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 1, backgroundColor: colors.grey[100] }} />


          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Typography variant="h6" component="div">
              Ref
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                fontWeight: "bold",
                maxWidth: "80%",  // Limit max width for text wrapping
                wordWrap: "break-word",  // Wrap long text
                overflowWrap: "break-word",
              }}
            >
              {referenceNumber}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default OrderCard;
