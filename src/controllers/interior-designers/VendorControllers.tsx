import axios from "axios";
import constants from "../../constants";
import {
  ProjectData,
  ReviewFormObject,
  VendorData,
} from "../../pages/interior-designers/Types";
import { FormEvent } from "react";

export const fetchVendorDetails = async (id: string) => {
  let data;
  const response = await axios.get(
    `${constants.apiBaseUrl}/vendor/details?vendor_id=${id}`
  );
  data = response.data;

  return data.data as VendorData;
};

export const fetchVendorProjects = async (id: string) => {
  let data;

  const response = await axios.get(
    `${constants.apiBaseUrl}/vendor/project/details?vendor_id=${id}`
  );
  data = response.data;

  return data.data as ProjectData[];
};

export const interiorDesignerOnboarding = async (processedFormData: any) => {
  return await axios.post(
    `${constants.apiBaseUrl}/vendor/onboard`,
    processedFormData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const submitInteriorDesignerReview = async (
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
  window.location.reload();
};

export const interiorDesignerList = async (
  themeFilters: Set<any>,
  spaceFilters: Set<any>,
  executionFilters: Set<any>
) => {
  return await axios.get(`${constants.apiBaseUrl}/vendor/list`, {
    params: {
      category: "INTERIOR_DESIGNER",
      sub_category_1: Array.from(themeFilters as Set<string>)
        .map((option) => option.toUpperCase())
        .join(","),
      sub_category_2: Array.from(spaceFilters as Set<string>)
        .map((option) => option.toUpperCase())
        .join(","),
      sub_category_3: Array.from(executionFilters as Set<string>)
        .map((option) => option.toUpperCase())
        .join(","),
    },
  });
};

export const uploadImage = async (
  projectId: number,
  formData: any,
  subCategories: any,
  spaceIndex: number
) => {
  return await axios.post(
    `${constants.apiBaseUrl}/image-upload/project?project_id=${projectId}&category=INTERIOR_DESIGNER&sub_category_2=${subCategories[spaceIndex]}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const deleteImage = async (
  projectId: number,
  imageName: any,
  subCategories: any,
  spaceIndex: number
) => {
  return await axios.delete(
    `${constants.apiBaseUrl}/image-upload/project?project_id=${projectId}&key=${imageName}&category=INTERIOR_DESIGNER&sub_category_2=${subCategories[spaceIndex]}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};
