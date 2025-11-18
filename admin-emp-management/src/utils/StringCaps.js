export const capitalizeFirstLetter = (input) => {
  if (typeof input !== "string") return ""; // Ensure input is a string
  
  const cleanedString = input.replace(/_/g, " ");
  return cleanedString.charAt(0).toUpperCase() + cleanedString.slice(1).toLowerCase();
};
