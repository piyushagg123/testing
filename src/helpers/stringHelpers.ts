const truncateText = (text: string, wordLimit: number): string => {
  if (text.length > wordLimit) {
    return text.slice(0, wordLimit) + "...";
  }
  return text;
};

const formatString = (str: string) => {
  let formattedStr = str?.replace(/_/g, " ");
  formattedStr = formattedStr
    ?.toLowerCase()
    ?.split(" ")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");

  return formattedStr;
};

export { truncateText, formatString };
