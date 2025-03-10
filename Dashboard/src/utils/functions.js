export function extractObjects(nestedArray) {
  return nestedArray
    .flat()
    .filter((item) => typeof item === "object" && item !== null);
}

// Function to format ISO date strings
export const formatDate = (isoString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
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
}

// Converts enum values to their corresponding string representations.
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
    default:
      return value;
  }
};
