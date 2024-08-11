import { formatCategory } from "../utils";
import config from "../config";
import img from "../assets/background.jpg";
import { Chip } from "@mui/material";

const VendorHead = ({ vendorData }) => {
  return (
    <div className="flex items-end gap-3">
      <div>
        {vendorData?.logo ? (
          <img
            src={`${config.apiImageUrl}/${vendorData.logo}`}
            alt=""
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
        <p>{}</p>
        <p className="font-bold text-base text-darkgrey">
          {formatCategory(vendorData?.business_name ?? "Unknown Business")}
        </p>
        <p className="mb-2 mt-2 flex gap-2 items-center">
          <span className="font-bold text-sm text-darkgrey">
            SPECIALIZED THEMES :
          </span>{" "}
          {formatCategory(vendorData?.sub_category_1 ?? "N/A")
            .split(",")
            .map((item, ind) => (
              <>
                <Chip
                  label={item}
                  variant="outlined"
                  key={ind}
                  sx={{ height: "25px" }}
                />
              </>
            ))}
        </p>

        <p className="flex gap-2 items-center">
          <span className="font-bold text-sm text-darkgrey">
            SPECIALIZED SPACES :
          </span>{" "}
          {formatCategory(vendorData?.sub_category_2 ?? "N/A")
            .split(",")
            .map((item, ind) => (
              <>
                <Chip
                  label={item}
                  variant="outlined"
                  key={ind}
                  sx={{ height: "25px" }}
                />
              </>
            ))}
        </p>
      </div>
    </div>
  );
};

export default VendorHead;
