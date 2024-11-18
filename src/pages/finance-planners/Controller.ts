import axios from "axios";
import constants from "../../constants";
import { ReviewFormObject, VendorData } from "./Types";
import { FormEvent } from "react";

const fetchFinancialAdvisorDetails = async (id: string) => {
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

const submitReview = async (
  event: FormEvent<HTMLFormElement>,
  professionalId: string | number,
  onSuccess: () => void,
  onError: (errorMessage: string) => void
) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const formObject: ReviewFormObject = {
    financial_advisor_id: Number(professionalId),
  };

  formData.forEach((value, key) => {
    if (key === "rating") {
      formObject[key as "rating"] = Number(value);
    } else {
      formObject[key as "body"] = value.toString();
    }
  });

  try {
    await axios.post(
      `${constants.apiBaseUrl}/financial-advisor/review`,
      formObject,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    onSuccess();
  } catch (error: any) {
    onError(error.response?.data?.debug_info || "Error submitting review");
  }

  window.location.reload();
};

const initializeFormData = (): VendorData => ({
  business_name: "",
  sebi_registered: false,
  started_in: "",
  number_of_employees: 0,
  address: "",
  city: "",
  state: "",
  description: "",
  aum_handled: 0,
  minimum_investment: 0,
  number_of_clients: 0,
  fees: 0,
  deals: [],
  investment_ideology: [],
  fees_type: [],
  social: {
    instagram: "",
    facebook: "",
    website: "",
  },
});

export { fetchFinancialAdvisorDetails, submitReview, initializeFormData };
