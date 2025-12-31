// const formatNumber = (value, decimals = 2) =>
//   Number(value || 0).toLocaleString("en-IN", {
//     minimumFractionDigits: decimals,
//     maximumFractionDigits: decimals,
//   });

// export default formatNumber;



const formatNumber = (value, decimals = 0) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export default formatNumber;
