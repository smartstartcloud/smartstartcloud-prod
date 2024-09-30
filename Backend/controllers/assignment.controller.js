import Assignment from '../models/assignment.models.js';

// Function to add new assignments and return their MongoDB ObjectIDs
export async function addNewAssignment(assignmentList) {
  try {
    // Use Promise.all to save all assignments concurrently
    const addedAssignmentIDs = await Promise.all(
      assignmentList.map(async (assignmentData) => {
        // Check if the assignment with the same orderID already exists
        let currentAssignment = await Assignment.findOne({ orderID: assignmentData.orderID });
        if (currentAssignment) {
          return currentAssignment._id; // If the assignment exists, return its ObjectID
        } else {
          // Create a new Assignment instance
          const newAssignment = new Assignment({
            orderID: assignmentData.orderID,
            assignmentName: assignmentData.assignmentName,
            assignmentType: assignmentData.assignmentType,
            assignmentProgress: assignmentData.assignmentProgress,
            assignmentPayment: assignmentData.assignmentPayment,
            assignmentFile: assignmentData.assignmentFile || [] // Default to empty array
          });

          // Save the assignment to the database and return the saved assignment's ObjectID
          const savedAssignment = await newAssignment.save();
          return savedAssignment._id;
        }
      })
    );

    return addedAssignmentIDs; // Return the array of added assignment IDs
  } catch (error) {
    console.error("Error adding assignments:", error);
    throw new Error('Failed to add assignments');
  }
}
