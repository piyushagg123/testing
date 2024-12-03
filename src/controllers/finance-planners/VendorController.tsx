import axios from "axios";
import constants from "../../constants";
import { VendorData } from "../../pages/finance-planners/Types";

export const fetchFinancialAdvisorDetails = async (id: string) => {
  let data;

  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advisor/details?financial_advisor_id=${id}`
  );
  data = response.data;
  if (data.data.deals) {
    data.data.deals = data.data.deals
      .split(",")
      .map((item: string) => item.trim());
  }
  if (data.data.investment_ideology) {
    data.data.investment_ideology = data.data.investment_ideology
      .split(",")
      .map((item: string) => item.trim());
  }
  if (data.data.fees_type) {
    data.data.fees_type = data.data.fees_type
      .split(",")
      .map((item: string) => item.trim());
  }

  return data.data as VendorData;
};

export const createFinancePlanner = async (processedFormData: any) => {
  return await axios.post(
    `${constants.apiBaseUrl}/financial-advisor/create`,
    processedFormData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const financePlannerList = async (
  dealFilters: Set<any>,
  investmentIdeologyFilters: Set<any>
) => {
  return await axios.get(`${constants.apiBaseUrl}/financial-advisor/advisors`, {
    params: {
      deals: Array.from(dealFilters as Set<string>)
        .map((option) => option.toUpperCase())
        .join(","),
      investment_ideology: Array.from(investmentIdeologyFilters as Set<string>)
        .map((option) => option.toUpperCase())
        .join(","),
    },
  });
};

export const updateFinancePlanner = async (data: any) => {
  await axios.post(`${constants.apiBaseUrl}/financial-advisor/update`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
