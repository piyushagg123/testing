import axios from "axios";
import constants from "../../constants";

export const fetchThemes = async (): Promise<any[]> => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/category/subcategory1/list?category=INTERIOR_DESIGNER`
  );
  if (!response) {
    throw new Error("Failed to fetch themes");
  }
  return response.data.data.value;
};

export const fetchSpaces = async (): Promise<any[]> => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/category/subcategory2/list?category=INTERIOR_DESIGNER`
  );
  if (!response) {
    throw new Error("Failed to fetch spaces");
  }
  return response.data.data.value;
};

export const fetchExecutionTypes = async (): Promise<any[]> => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/category/subcategory3/list?category=INTERIOR_DESIGNER`
  );
  if (!response) {
    throw new Error("Failed to fetch execution types");
  }
  return response.data.data.value;
};
