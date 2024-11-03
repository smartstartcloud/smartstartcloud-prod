import Assignment from "../models/assignment.models.js";

// Function to create a new assignment and update relevant records
export const newAssignmentDynamic = async (assignmentList) => {    
    try {
        // Use Promise.all to save all Assignment concurrently
        const addedAssignmentIDs = await Promise.all(
        assignmentList.map(async (assignmentData) => {
            // Create a new Assignment instance
            const newAssignment = new Assignment({
            assignmentName: assignmentData.assignmentName,
            assignmentType: assignmentData.assignmentType,
            assignmentDeadline: assignmentData.assignmentDeadline,
            assignmentNature: "dynamic",
            });

            // Save the student to the database and return the saved student's ObjectID
            const savedAssignment = await newAssignment.save();
            return savedAssignment._id;
        })
        );

        return addedAssignmentIDs; // Return the array of added Assignment IDs

        // // Step 1: Fetch the degree associated with the moduleID
        // const degree = await Degree.findOne({
        //   degreeModules: { $elemMatch: { moduleCode: moduleCode } },
        // });

        // if (!degree) {
        //   return res.status(404).json({ error: "Degree not found" });
        // }

        // const studentList = degree.degreeStudentList;

        // // Step 2: Create the new assignment
        // const createdAssignment = await moduleCreateNewAssignment(
        //   orderID,
        //   assignmentName,
        //   assignmentType,
        //   assignmentDeadline,
        //   assignmentProgress,
        //   assignmentPayment,
        //   assignmentGrade
        // );

        // // Step 3: Update ModuleAssignment for each student in the degree
        // await Promise.all(
        //   studentList.map(async (studentID) => {
        //     await ModuleAssignment.findOneAndUpdate(
        //       { moduleID, studentID },
        //       {
        //         $setOnInsert: { studentID, moduleID },
        //         $addToSet: {
        //           assignments: {
        //             orderID: createdAssignment.orderID,
        //             assignmentName: createdAssignment.assignmentName,
        //             assignmentType: createdAssignment.assignmentType,
        //             assignmentDeadline: createdAssignment.assignmentDeadline,
        //           },
        //         },
        //       },
        //       { upsert: true }
        //     );
        //   })
        // );

        // // Step 4: Also add the assignment to the Module model
        // await moduleAddAssignmentToModule(moduleID, createdAssignment);

        // res.status(200).json({
        // message:
        //     "Assignment added and propagated to all students in the degree successfully",
        // });
    } catch (error) {
        console.error("Error in newAssignment:", error);
        throw new Error("Internal Server Error");
        // res.status(500).json({ error: "Internal Server Error" });
    }
};
