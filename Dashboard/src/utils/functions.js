export function extractObjects(nestedArray) {
  return nestedArray
    .flat()
    .filter((item) => typeof item === "object" && item !== null);
}
