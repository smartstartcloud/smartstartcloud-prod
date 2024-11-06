import Assignment from "../models/assignment.models.js";
import ModuleAssignment from "../models/moduleAssignment.models.js";

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
        return addedAssignmentIDs; // Return the array of added Assignment IDs
    } catch (error) {
        console.error("Error in newAssignment:", error);
        throw new Error("Internal Server Error");
        // res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createNewModuleStudentAssignment = async (moduleID, studentList, assignmentList) => {
    for (const assignments of assignmentList) {
        for (let i = 0; i < studentList.length; i++) {
            let existingModuleAssignment = await ModuleAssignment.findOne({
                studentID: studentList[i],
                moduleID: moduleID,
            });
            if (existingModuleAssignment) {
                // If it exists, add the new assignment ID to the assignments array if it's not already present
                if (
                !existingModuleAssignment.assignments.includes(assignments[i])
                ) {
                existingModuleAssignment.assignments.push(assignments[i]);
                await existingModuleAssignment.save(); // Save the updated document
                // console.log("existingModuleAssignment", existingModuleAssignment);
                }
            } else {
                // If it does not exist, create a new ModuleAssignment document
                const newModuleAssignment = new ModuleAssignment({
                studentID: studentList[i],
                moduleID: moduleID,
                assignments: [assignments[i]], // Initialize with the first assignment
                });
                await newModuleAssignment.save();
                // console.log("newModuleAssignment", newModuleAssignment);
            }
        }
    }
}
