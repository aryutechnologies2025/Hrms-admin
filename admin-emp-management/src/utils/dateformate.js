export const formatDate = (date, format) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // switch (format) {
    //   case "yyyy-MM-dd":
    //     return `${year}-${month}-${day}`;
    //   case "MM/dd/yyyy":
    return `${month}/${day}/${year}`;
    //   case "dd-MM-yyyy":
    //     return `${day}-${month}-${year}`;
    //   default:
    //     return `${year}-${month}-${day}`;
    // }
  }; 