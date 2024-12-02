import axios from "axios";

export const fetchOptions = async (apiEndpoint: string) => {
  const response = await axios.get(apiEndpoint);

  return response.data.data.value;
};
