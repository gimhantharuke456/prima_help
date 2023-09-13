export const dateFormatter = (currentDate) => {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since it is zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");

  let formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};
