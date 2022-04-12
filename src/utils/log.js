const DEBUG_MODE = process.env.NODE_ENV === "development";

export const log = {
  success: (message, data = {}) => {
    if (DEBUG_MODE === true) {
      console.log(`%c${message}`, "color: limegreen;", data);
    } else return;
  },
  error: (message, data = {}) => {
    if (DEBUG_MODE === true) {
      console.log(`%c${message}`, "color: red;", data);
    } else return;
  },
  info: (message, data = {}) => {
    if (DEBUG_MODE === true) {
      console.log(`%c${message}`, "color: dodgerblue;", data);
    } else return;
  },
};
