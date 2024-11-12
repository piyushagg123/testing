import axios from "axios";
import constants from "../../constants";
import { ReviewFormObject, VendorData } from "./Types";
import { FormEvent } from "react";

const fetchFinancialAdvisorDetails = async (id: string) => {
  let data;

  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advaaisor/details?financial_advisor_id=${id}`
  );
  data = response.data;

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
};

export { fetchFinancialAdvisorDetails, submitReview };
