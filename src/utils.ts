const truncateText = (text: string, wordLimit: number): string => {
    if (text.length > wordLimit) {
      return text.slice(0, wordLimit) + "...";
    }
    return text;
  };


export  {truncateText}