import moment from "moment";

export const yearDifferenceBetweenTwoDates = (date1, date2) => {
  return date2
    ? new Date(date2).getFullYear() - new Date(date1).getFullYear()
    : new Date().getFullYear() - new Date(date1).getFullYear();
};

export const encodeDate = (date) => moment(date).format("YYYY-MM-DD");

export const encodeDateYear = (date) => moment(date).format("YYYY");
