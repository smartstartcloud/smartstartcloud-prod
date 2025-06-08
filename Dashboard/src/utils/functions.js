import { format } from "date-fns";

export function extractObjects(nestedArray) {
  return nestedArray
    .flat()
    .filter((item) => typeof item === "object" && item !== null);
}

// Function to format ISO date strings
export const formatDate = (isoString) => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-GB", options).format(new Date(isoString));
};

// Function to parse a year ID string into a Date object
export const parseYearId = (yearId) => {
  const [month, year] = yearId.split("_");
  const monthMap = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };
  return new Date(year, monthMap[month.toLowerCase()]);
};

// Function to sort an array of objects by a specified property
export const sortByProperty = (array, property, order = "asc") => {
  return array.sort((a, b) => {
    const aValue =
      property === "year_id" ? parseYearId(a[property]) : a[property];
    const bValue =
      property === "year_id" ? parseYearId(b[property]) : b[property];

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });
};

// Converts enum values to their corresponding string representations.
export const enumToString = (type, value) => {
  if (!value) return "No value";
  switch (type) {
    case "studentStatus":
      return value === "active"
        ? "ACTIVE"
        : value === "inactive"
        ? "INACTIVE"
        : value === "withdrawn"
        ? "WITHDRAWN"
        : "NO STATUS";
    case "assignmentProgress":
      return value === "TBA"
        ? "To Be Announced"
        : value === "ORDER ID ASSIGNED"
        ? "Order ID Assigned"
        : value === "FILE READY TO UPLOAD"
        ? "File Ready To Upload"
        : value === "FILE UPLOADED"
        ? "File Upload"
        : value === "WAITING TO BE GRADED"
        ? "Waiting To Be Graded"
        : value === "PASSED"
        ? "Passed"
        : value === "FAILED"
        ? "Failed"
        : "No Status";
    case "paymentPlan":
      return value === "year"
        ? "Whole year plan"
        : value === "installment"
        ? "Whole year - 2 instalment plan"
        : value === "individual"
        ? "Individual plan"
        : "No Plan";
    case "otherPaymentMethod":
      return value === "cash"
        ? "CASH"
        : value === "bank"
        ? "BANK"
        : value === "referral"
        ? "REFERRAL"
        : "OTHER";
    case "paymentVerificationStatus":
      return value === "approved"
        ? "APPROVED"
        : value === "awaiting approval"
        ? "PENDING"
        : value === "rejected"
        ? "REJECTED"
        : "No Status";
    case "paymentStatus":
      return value === "PP"
        ? "Partially Paid"
        : value === "NP"
        ? "Outstanding"
        : value === "PAID"
        ? "Paid"
        : "No Status";
    default:
      return value;
  }
};

export const extractStudentStatus = (studentList) => {
  let active = 0;
  let inactive = 0;
  let withdrawn = 0;
  let noStatus = 0;
  studentList.map((student) => {
    switch (student.studentStatus) {
      case "active":
        return active++;
      case "inactive":
        return inactive++;
      case "withdrawn":
        return withdrawn++;
      default:
        return noStatus++;
    }
  });
  return { active, inactive, withdrawn, noStatus };
};

export const extractAssignmentPriority = (degreeModule) => {
  const priorityList = [];
  degreeModule.forEach((module) => {
    const moduleName = module.moduleName;
    const assignmentList = module.moduleAssignments;
    assignmentList.forEach((assignment) => {
      const assignmentName = assignment[0].assignmentName;
      // const deadline = format(assignment[0].assignmentDeadline, "dd/MM/yyyy");
      const deadline = assignment[0].assignmentDeadline;
      priorityList.push({ moduleName, assignmentName, deadline });
    });
  });
  const nextAssignment = getNextUpcomingAssignment(priorityList);  
  if (nextAssignment !== null){
    nextAssignment.deadline = format(nextAssignment.deadline, "dd/MM/yyyy");
  }
  return nextAssignment;
};

function getNextUpcomingAssignment(assignments) {
  const now = new Date();

  const upcoming = assignments
    .map((item) => {
      const deadlineDate = new Date(item.deadline);
      const diffInDays = (deadlineDate - now) / (1000 * 60 * 60 * 24); // ms → days

      return {
        ...item,
        deadlineDate,
        color: diffInDays <= 7 ? "red" : "default",
      };
    })
    .filter((item) => item.deadlineDate >= now)
    .sort((a, b) => a.deadlineDate - b.deadlineDate);

  return upcoming.length > 0 ? upcoming[0] : null;
}
