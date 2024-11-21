export const dateConvert = (data: string, showTime: boolean = true) => {
  const date = new Date(data);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };

  if (showTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return date.toLocaleString(undefined, options);
};
