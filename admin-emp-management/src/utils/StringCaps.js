// export const capitalizeFirstLetter = (input) => {
//   if (typeof input !== "string") return ""; // Ensure input is a string
  
//   const cleanedString = input.replace(/_/g, " ");
//   return cleanedString.charAt(0).toUpperCase() + cleanedString.slice(1).toLowerCase();
// };
export const capitalizeFirstLetter = (input) => {
  if (typeof input !== "string") return "";

  return input
    .replace(/_/g, " ")              // replace underscores with space
    .toLowerCase()
    .split(" ")
    .filter(Boolean)                 // remove extra spaces
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};
