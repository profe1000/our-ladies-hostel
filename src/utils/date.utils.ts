export const convertToShortDate = (date: string) => {
  const curdate = new Date(date);
  return curdate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    weekday: "short",
  });
};
