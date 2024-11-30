import axios from "axios";
import constants from "../constants";
import { Review } from "../components/Reviews";
import { ReviewFormObject as FinancePlannerReviewFormObject } from "../pages/finance-planners/Types";
import { ReviewFormObject as InteriorDesignerReviewFormObject } from "../pages/interior-designers/Types";

export const fetchReviews = async (id: number, vendorType?: string) => {
  let data;
  if (vendorType) {
    if (id === -1) {
      const response = await axios.get(
        `${constants.apiBaseUrl}/vendor/auth/reviews`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      data = response.data;
    } else {
      const response = await axios.get(
        `${constants.apiBaseUrl}/vendor/reviews?vendor_id=${id}`
      );
      data = response.data;
    }
  } else {
    const response = await axios.get(
      `${constants.apiBaseUrl}/financial-advisor/reviews?financial_advisor_id=${id}`
    );
    data = response.data;
  }
  return data.data;
};

export const updateReview = async (review: Review, professional?: string) => {
  if (professional === "interiorDesigner") {
    await axios.post(`${constants.apiBaseUrl}/vendor/review/update`, review, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } else {
    await axios.post(
      `${constants.apiBaseUrl}/financial-advisor/review/update`,
      review,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }
};

export const deleteReview = async (reviewId: number, vendorType?: string) => {
  if (vendorType === "interiorDesigner") {
    await axios.delete(
      `${constants.apiBaseUrl}/vendor/review?review_id=${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } else {
    await axios.delete(
      `${constants.apiBaseUrl}/financial-advisor/review?review_id=${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }
};

export const submitFinancePlannerReview = async (
  formData: any,
  professionalId: string | number,
  onSuccess: () => void,
  onError: (errorMessage: string) => void
) => {
  const formObject: FinancePlannerReviewFormObject = {
    financial_advisor_id: Number(professionalId),
  };

  formData.forEach((value: any, key: any) => {
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

export const submitInteriorDesignerReview = async (
  formData: any,
  professionalId: string | number,
  onSuccess: () => void,
  onError: (errorMessage: string) => void
) => {
  const formObject: InteriorDesignerReviewFormObject = {
    vendor_id: Number(professionalId),
  };

  formData.forEach((value: any, key: any) => {
    if (key.startsWith("rating_")) {
      (formObject[
        key as "rating_quality" | "rating_execution" | "rating_behaviour"
      ] as number) = Number(value);
    } else {
      formObject[key as "body"] = value.toString();
    }
  });

  try {
    await axios.post(`${constants.apiBaseUrl}/vendor/review`, formObject, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    onSuccess();
  } catch (error: any) {
    onError(error.response?.data?.debug_info || "Error submitting review");
  }
};
