import Assignment from "../models/assignment.models.js";

// Function to create a new assignment and update relevant records
export const newAssignmentDynamic = async (assignmentList, studentList) => {        
    try {
        // Use Promise.all to save all Assignment concurrently
        const addedAssignmentIDs = await Promise.all(
            assignmentList.map(async (assignmentData) => { 
                const assignmentIDs = [];
                // Create a new Assignment instance
                for (let i = 0; i < studentList.length; i++) {
                // Create a new Assignment instance
                const newAssignment = new Assignment({
                    assignmentName: assignmentData.assignmentName,
                    assignmentType: assignmentData.assignmentType,
                    assignmentDeadline: assignmentData.assignmentDeadline,
                    assignmentNature: "dynamic",
                });

                // Save the assignment to the database and collect its ObjectID
                const savedAssignment = await newAssignment.save();
                assignmentIDs.push(savedAssignment._id); // Collect each saved ID
                }
                return assignmentIDs;
            })
        );
        
        return addedAssignmentIDs.flat(); // Return the array of added Assignment IDs
    } catch (error) {
        console.error("Error in newAssignment:", error);
        throw new Error("Internal Server Error");
        // res.status(500).json({ error: "Internal Server Error" });
    }
};
