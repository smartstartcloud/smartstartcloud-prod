import Module from "../models/module.models.js";
import ModuleStudentFinance from "../models/moduleStudentFinance.models.js";

export const addNewPayment = async (studentID, moduleID, moduleCost) => {
    try {
        const newPayment = new ModuleStudentFinance({
          studentID: studentID,
          moduleID: moduleID,
          modulePrice: moduleCost,
        });
        // console.log('ashche', newPayment, moduleCost);
        
        await newPayment.save();
        return newPayment._id;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getPaymentDetails = async (req, res) => {
    const { assignmentID, moduleCode, studentID } = req.body;
    try {
    // Find the module ID using the moduleCode
    const module = await Module.findOne({ moduleCode });
    if (!module) {
        return res.status(404).json({ error: "Module not found" });
    }

    // Find all records in ModuleStudentFinance where studentID and moduleID match
    const finances = await ModuleStudentFinance.find({
        studentID,
        moduleID: module._id,
    });

    res.status(200).json(finances[0] );
    } catch (error) {
        console.error("Error fetching finance data:", error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
};