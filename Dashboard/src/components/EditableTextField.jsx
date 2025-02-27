import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const EditableTextField = ({
  row,
  assignmentDataLists,
  handleDropdownChange,
  dataType,
  label
}) => {
  // Manage local value state
  const [value, setValue] = useState(
    assignmentDataLists[row.assignmentList[0]._id] || dataType || ""
  );

  return (
    <TextField
      type="text"
      variant="outlined"
      fullWidth
      label={label}
      value={value} // Controlled by local state
      onChange={(event) => setValue(event.target.value)} // Update local state on change
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleDropdownChange(row.assignmentList[0]._id, value); // Use updated value
        }
      }}
      onBlur={(event) => {
        handleDropdownChange(row.assignmentList[0]._id, value); // Use updated value
      }}
      sx={{ mb: 2 }}
    />
  );
};

export default EditableTextField;
