import axios from "axios";
import constants from "../../constants";
import { ProjectData, ReviewFormObject, VendorData } from "./types";
import { FormEvent } from "react";

const fetchVendorDetails = async (id: string, renderProfileView: boolean) => {
  let data;
  if (renderProfileView) {
    const response = await axios.get(
      `${constants.apiBaseUrl}/vendor/auth/details`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    data = response.data;
  } else {
    const response = await axios.get(
      `${constants.apiBaseUrl}/vendor/details?vendor_id=${id}`
    );
    data = response.data;
  }

  return data.data as VendorData;
};

const fetchVendorProjects = async (id: string, renderProfileView: boolean) => {
  let data;
  if (renderProfileView) {
    const response = await axios.get(
      `${constants.apiBaseUrl}/vendor/auth/project/details`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    data = response.data;
  } else {
    const response = await axios.get(
      `${constants.apiBaseUrl}/vendor/project/details?vendor_id=${id}`
    );
    data = response.data;
  }
  return data.data as ProjectData[];
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
    vendor_id: Number(professionalId),
  };

  formData.forEach((value, key) => {
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

export { fetchVendorDetails, fetchVendorProjects, submitReview };
