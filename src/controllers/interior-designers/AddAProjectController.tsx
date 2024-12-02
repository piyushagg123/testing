import axios from "axios";
import constants from "../../constants";

export const AddProject = async (processedFormData: any) => {
  const response = await axios.post(
    `${constants.apiBaseUrl}/vendor/project`,
    processedFormData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
