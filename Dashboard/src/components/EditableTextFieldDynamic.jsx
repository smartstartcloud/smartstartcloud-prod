import { TextField } from '@mui/material';
import React, { useState } from 'react'

const EditableTextFieldDynamic = ({
  assignment,
  assignmentDataLists,
  handleDropdownChange,
  dataType,
  label
}) => {
  // Manage local value state
  const [value, setValue] = useState(
    assignmentDataLists[assignment._id] || dataType || ""
  );

  return (
    <TextField
      type="number"
      variant="outlined"
      fullWidth
      label={label}
      value={value} // Controlled by local state
      onChange={(event) => setValue(event.target.value)} // Update local state on change
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleDropdownChange(assignment._id, value); // Use updated value
        }
      }}
      sx={{ mb: 2 }}
    />
  );
};

export default EditableTextFieldDynamic