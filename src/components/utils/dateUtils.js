export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
  };
  return date.toLocaleDateString(undefined, options);
};
