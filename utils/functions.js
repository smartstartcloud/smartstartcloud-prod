// Function to format ISO date strings
export const formatDate = (isoString) => {
  if (!isoString) return "Invalid Date"; // Handle null/undefined cases

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };

  return new Intl.DateTimeFormat("en-GB", options).format(date);
};

export const formatDateShort = (isoString) => {
  if (!isoString) return "Invalid Date"; // Handle null/undefined cases

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// convert "january_2025" to "JANUARY 2025"
export const formatDateString = (dateString) => {    
  // Split the input string by underscore
  const [month, year] = dateString.split('_');

  // Capitalize the first letter of the month and lowercase the rest
  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

  // Combine the formatted month and year with a space
  return `${formattedMonth} ${year}`;
}

export const enumToString = (type, value) => {
  switch (type) {
    case "paymentPlan":
      return value === "year"
        ? "Whole year plan"
        : value === "installment"
        ? "Whole year - 2 instalment plan"
        : "Individual plan";
    case "otherPaymentMethod":
      return value === "cash"
        ? "CASH"
        : value === "bank"
        ? "CASH"
        : value === "referral"
        ? "CASH"
        : "other";
    case "paymentVerificationStatus":
      return value === "approved"
        ? "APPROVED"
        : value === "awaiting approval"
        ? "PENDING"
        : "No Status";
    default:
      return value;
  }
}
