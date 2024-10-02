import { Chip } from "@mui/material";
import constants from "../constants";
import img from "../assets/noImageinProject.jpg";

interface VendorData {
  logo?: string;
  category: string;
  sub_category_1: string;
  sub_category_2: string;
  sub_category_3: string;
  description: string;
  business_name: string;
  average_project_value: string;
  number_of_employees: number;
  projects_completed: number;
  mobile: string;
  email: string;
  city: string;
  social?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

interface ProfessionalHeaderProps {
  vendorData: VendorData | undefined;
}

const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({
  vendorData,
}) => {
  const formatCategory = (str: string) => {
    let formattedStr = str.replace(/_/g, " ");
    formattedStr = formattedStr
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedStr;
  };
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:mt-[2em] mb-[1em]">
      <div className="m-auto md:m-0 flex flex-col justify-center items-center">
        {vendorData?.logo ? (
          <img
            src={`${constants.apiImageUrl}/${vendorData.logo}`}
            alt="Vendor Logo"
            className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full"
          />
        ) : (
          <img
            src={img}
            alt=""
            className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full"
          />
        )}
        <p className="font-semibold text-base text-black text-center md:text-left mx-3 md:hidden">
          {formatCategory(vendorData?.business_name ?? "Unknown Business")}
        </p>
      </div>
      <div className="mx-3">
        <p className="font-semibold text-base text-black text-center md:text-left hidden md:block">
          {formatCategory(vendorData?.business_name ?? "Unknown Business")}
        </p>
        <div className="mb-2 mt-2 flex flex-col md:flex-row gap-2 items-start md:items-center">
          <span className="font-bold text-[11px] md:text-sm text-darkgrey">
            SPECIALIZED THEMES :
          </span>{" "}
          <div className="flex flex-wrap gap-1">
            {formatCategory(vendorData?.sub_category_1 ?? "N/A")
              .split(",")
              .map((item, ind) => (
                <Chip
                  label={item.charAt(0).toUpperCase() + item.slice(1)}
                  variant="outlined"
                  key={ind}
                  sx={{ height: "20px", fontSize: "11px" }}
                />
              ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
          <span className="font-bold text-[11px] md:text-sm text-darkgrey">
            SPECIALIZED SPACES :
          </span>
          <div className="flex flex-wrap gap-1">
            {formatCategory(vendorData?.sub_category_2 ?? "N/A")
              .split(",")
              .map((item, ind) => (
                <Chip
                  label={item.charAt(0).toUpperCase() + item.slice(1)}
                  variant="outlined"
                  key={ind}
                  sx={{ height: "20px", fontSize: "11px" }}
                />
              ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
          <span className="font-bold text-[11px] md:text-sm text-darkgrey">
            EXECUTION TYPE :
          </span>{" "}
          {(vendorData?.sub_category_3 ?? "N/A")
            .split(",")
            .map((item: string, ind: number) => (
              <Chip
                label={
                  item === "DESIGN"
                    ? constants.DESIGN
                    : item === "MATERIAL_SUPPORT"
                    ? constants.MATERIAL_SUPPORT
                    : constants.COMPLETE
                }
                variant="outlined"
                key={ind}
                sx={{
                  height: "20px",
                  fontSize: "11px",
                  maxWidth: "90vw",
                  overflowWrap: "break-word",
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalHeader;
