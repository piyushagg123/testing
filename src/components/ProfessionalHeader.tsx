import { Chip } from "@mui/material";
import constants from "../constants";
import img from "../assets/noImageinProject.jpg";

const ProfessionalHeader = ({ vendorData }) => {
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
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mt-[2em] mb-[1em]">
      <div className="m-auto md:m-0">
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
      </div>
      <div>
        <p className="font-bold text-base text-darkgrey m-auto">
          {formatCategory(vendorData?.business_name ?? "Unknown Business")}
        </p>
        <p className="mb-2 mt-2 flex flex-col md:flex-row gap-2 items-start md:items-center">
          <span className="font-bold text-sm text-darkgrey">
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
                  sx={{ height: "25px" }}
                />
              ))}
          </div>
        </p>

        <p className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
          <span className="font-bold text-sm text-darkgrey">
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
                  sx={{ height: "25px" }}
                />
              ))}
          </div>
        </p>
        <p className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
          <span className="font-bold text-sm text-darkgrey">
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
                  height: "25px",
                  maxWidth: "95vw",
                  overflowWrap: "break-word",
                }}
              />
            ))}
        </p>
      </div>
    </div>
  );
};

export default ProfessionalHeader;