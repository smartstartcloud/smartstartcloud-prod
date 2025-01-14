export function extractObjects(nestedArray) {
  return nestedArray
    .flat()
    .filter((item) => typeof item === "object" && item !== null);
}

// Function to format ISO date strings
export const formatDate = (isoString) => {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(isoString));
};
