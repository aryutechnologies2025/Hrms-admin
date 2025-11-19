import { useContext } from "react";
import { SettingsContext } from "../App";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const useDateFormatDynamic = () => {
  const { dynamicDateFormat } = useContext(SettingsContext);

  const formatedInputDate = (dateString) => {
    if (!dateString) return "";

    const parsedDate = dynamicDateFormat
      ? dayjs(dateString, dynamicDateFormat)
      : dayjs(dateString);

     return parsedDate.isValid() ? parsedDate.toDate() : null; 
  };

  return { formatedInputDate };
};