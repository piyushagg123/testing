export type VendorData = {
  logo?: string;
  deals?: string;
  investment_ideology?: string;
  fees_type?: string;
  fees?: number;
  number_of_clients?: number;
  aum_handled?: number;
  sebi_registered?: boolean;
  minimum_investment?: number;
  description: string;
  business_name: string;
  number_of_employees: number;
  mobile: string;
  email: string;
  started_in: string;
  city: string;
  social?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
};

export type ReviewFormObject = {
  title?: string;
  body?: string;
  rating?: number;
  financial_advisor_id?: number;
};

export type ProfessionalInfoProps = {
  renderProfileView: boolean;
  renderProfessionalInfoView: boolean;
};
