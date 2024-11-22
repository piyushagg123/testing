import { VendorData } from "./Types";

const initializeFormData = (): VendorData => ({
  business_name: "",
  sebi_registered: false,
  started_in: "",
  number_of_employees: 0,
  address: "",
  city: "",
  state: "",
  description: "",
  aum_handled: 0,
  minimum_investment: 0,
  number_of_clients: 0,
  fees: 0,
  deals: [],
  investment_ideology: [],
  fees_type: [],
  social: {
    instagram: "",
    facebook: "",
    website: "",
  },
});

export { initializeFormData };
