import axios from "axios";
import constants from "../../constants";
import { ProjectData, VendorData } from "../../pages/interior-designers/Types";

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

export const createInteriorDesigner = async (processedFormData: any) => {
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

export const fetchInteriorDesignerList = async (
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

export const uploadProjectImage = async (
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

export const deleteProjectImage = async (
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
