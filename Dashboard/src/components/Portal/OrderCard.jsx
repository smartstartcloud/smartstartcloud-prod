import { Box, Card, CardActionArea, CardContent, Typography, useTheme, Divider, IconButton } from '@mui/material';
import React from 'react';
import { tokens } from '../../theme';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LinkIcon from "@mui/icons-material/Link";
const OrderCard = ({
  orderDetails,
  key,
  referenceNumber,
  handleIDClick,
  handleOrderIdDelete,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  

  return (
    <Card
      onClick={() => handleIDClick(orderDetails.orderID)}
      sx={{
        minWidth: "270px", // Increased minimum width
        maxWidth: "300px", // Optional: Limit maximum width
        background: `linear-gradient(210deg, ${
          orderDetails.linkStatus
            ? colors.greenAccent[800]
            : colors.blueAccent[800]
        }, ${
          orderDetails.linkStatus
            ? colors.greenAccent[900]
            : colors.blueAccent[900]
        })`,
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        overflow: "visible",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 22px rgba(0,0,0,0.2)",
        },
        color: colors.grey[50],
      }}
    >
      <CardActionArea>
        <CardContent>
          {!orderDetails.linkStatus && (
            <IconButton
              onClick={(e) => handleOrderIdDelete(e, orderDetails)}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                borderRadius: "100%",
                border: "white 1px solid",
                backgroundColor: colors.redAccent[500],
                color: colors.grey[100],
                transform: "translate(50%, -50%)",
                "&:hover": {
                  backgroundColor: colors.redAccent[600],
                  transform: "translate(50%, -50%) scale(1.1)",
                  transition: "transform 0.2s",
                },
                boxShadow: 3,
                padding: "4px",
              }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          )}
          {orderDetails.linkStatus && (
            <LinkIcon
              sx={{
                fontSize: 32,
                color: "#000",
                position: "absolute",
                top: 0,
                left: "50%",
                border: "2px solid black",
                borderRadius: "100%",
                backgroundColor: "white",
                transform: "translate(0%, -50%)",
                padding: "0px 2px",
              }}
            />
          )}
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
              sx={{
                fontWeight: "bold",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {orderDetails.orderID}
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
                maxWidth: "80%", // Limit max width for text wrapping
                wordWrap: "break-word", // Wrap long text
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
