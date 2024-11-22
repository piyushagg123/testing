import axios from "axios";
import constants from "../constants";

export const handleStateChange = async ({
  event: _event,
  value,
  setFormData,
  setCities,
  setLoadingCities,
}: {
  event: React.SyntheticEvent;
  value: string | null;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setCities: React.Dispatch<React.SetStateAction<any[]>>;
  setLoadingCities: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  setFormData((prevData: any) => ({
    ...prevData,
    state: value?.toString() ?? "",
    city: "",
  }));
  setCities([]);
  setLoadingCities(true);

  if (value) {
    try {
      const response = await axios.get(
        `${constants.apiBaseUrl}/location/cities?state=${value}`
      );
      setCities(response.data.data);
    } catch (error) {
    } finally {
      setLoadingCities(false);
    }
  } else {
    setLoadingCities(false);
  }
};

export const fetchStateData = async () => {
  const { data } = await axios.get(`${constants.apiBaseUrl}/location/states`);
  return data.data;
};
