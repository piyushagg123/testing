import axios from "axios";
import constants from "../constants";

const uploadLogo = async (formData: any) => {
  await axios.post(`${constants.apiBaseUrl}/image-upload/logo`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export { uploadLogo };
