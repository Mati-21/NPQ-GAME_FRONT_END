import moment from "moment";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];



export const formatData = function (date) {
  const m = moment(date);

  const parts = {
    year: m.year(),
    month: months[m.month()],
    day: m.date(),
    hour: m.hour(),
    minute: m.minute(),
    second: m.second(),
    offset: m.utcOffset(), // minutes
  };

  return parts;
};
