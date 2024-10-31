import { defaultUserDetails } from "../context/Login";

export function checkUserDetailsExist(authContext: any): boolean {
  if (!authContext) {
    return false;
  }

  const { userDetails } = authContext;

  return Object.keys(defaultUserDetails).some(
    (key) =>
      userDetails[key as keyof typeof defaultUserDetails] !==
      defaultUserDetails[key as keyof typeof defaultUserDetails]
  );
}
