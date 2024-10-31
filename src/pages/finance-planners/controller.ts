import axios from "axios";
import constants from "../../constants";
import { VendorData } from "./types";

const fetchVendorDetails = async (id: string) => {
  let data;

  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advisor/details?financial_advisor_id=${id}`
  );
  data = response.data;

  return data.data as VendorData;
};

export { fetchVendorDetails };
