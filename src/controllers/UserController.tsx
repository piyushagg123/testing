import axios from "axios";
import constants from "../constants";

export const fetchUserData = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    const { data } = await axios.get(`${constants.apiBaseUrl}/user/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data;
  } else {
    throw Error();
  }
};

export const getOTP = async (email: string) => {
  return await axios.get(
    `${constants.apiBaseUrl}/user/password-reset/otp?email=${email}`
  );
};

export const validateOTP = async (otp: string, email: string) => {
  return await axios.get(
    `${constants.apiBaseUrl}/user/password-reset/validate-otp?otp=${otp}&email=${email}`
  );
};

export const resetPassword = async (
  accessToken: string,
  newPassword: string
) => {
  return await axios.post(
    `${constants.apiBaseUrl}/user/password-reset/update`,
    { password: newPassword },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const logOut = async () => {
  return await axios.delete(`${constants.apiBaseUrl}/user/logout`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const signUp = async (formObject: any) => {
  return await axios.post(`${constants.apiBaseUrl}/user/register`, formObject);
};

export const login = async (formObject: any) => {
  return await axios.post(`${constants.apiBaseUrl}/user/login`, formObject);
};
