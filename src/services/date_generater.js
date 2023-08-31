import { dateFormatter } from "./date_formatter";

export const dateGenerator = (numberOfDays) => {
  const today = new Date();
  const pastDaysArray = [];

  for (let i = numberOfDays - 1; i >= 0; i--) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);
    pastDaysArray.push(dateFormatter(pastDate));
  }
  pastDaysArray.reverse();
  return pastDaysArray;
};
