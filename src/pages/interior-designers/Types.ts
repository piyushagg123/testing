export type VendorData = {
  logo?: string | null;
  category: string;
  sub_category_1: string | string[];
  sub_category_2: string | string[];
  sub_category_3: string | string[];
  description: string;
  business_name: string;
  average_project_value: string;
  number_of_employees: number;
  projects_completed: number;
  mobile?: string;
  email?: string;
  city: string;
  social?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  address?: string;
  started_in?: string;
  state?: string;
};

export type ProjectData = {
  images: Record<string, string[]>;
  title: string;
  description: string;
  city: string;
  state: string;
  sub_category_1: string;
  sub_category_2: string;
  start_date: string;
  end_date: string;
};

export type ReviewFormObject = {
  title?: string;
  body?: string;
  rating_quality?: number;
  rating_execution?: number;
  rating_behaviour?: number;
  vendor_id?: number;
};

export type ProfessionalInfoProps = {
  renderProfessionalInfoView: boolean;
  vendor_id?: number;
};
