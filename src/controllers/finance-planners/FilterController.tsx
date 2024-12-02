import axios from "axios";
import constants from "../../constants";

export const fetchDeals = async (): Promise<any[]> => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advisor/deals`
  );
  if (!response) {
    throw new Error("Failed to fetch deals");
  }
  return response.data.data;
};

export const fetchInvestmentIdeology = async (): Promise<any[]> => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advisor/investment-ideology`
  );
  if (!response) {
    throw new Error("Failed to fetch Investment Ideologies");
  }
  return response.data.data;
};
