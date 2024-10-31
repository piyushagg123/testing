import React from "react";
import { Rating } from "@mui/material";
import { truncateText } from "../helpers/stringHelpers";
import constants from "../constants";
import NoProjectImage from "../assets/noImageinProject.jpg";

interface ProfessionalProps {
  img: string;
  rating: number;
  about: string;
  profCat: string;
}

const Professional: React.FC<ProfessionalProps> = ({
  img,
  rating,
  about,
  profCat,
}) => {
  return (
    <div className="flex gap-8 mb-7 items-center sm:items-start flex-col sm:flex-row mt-3 sm:mt-0 text-black px-4">
      <div>
        <img
          src={img ? `${constants.apiImageUrl}/${img}` : NoProjectImage}
          alt="Professional"
          className="h-[192px] w-[300px] sm:w-[342px] rounded-[10px] sm:max-w-[342px]"
        />
      </div>

      <div className="flex flex-col justify-center xl:flex-row items-start w-[90vw] md:w-auto">
        <div className=" ">
          <div className="flex flex-col gap-1 items-start">
            <span className="font-bold text-base text-black">{profCat}</span>
            <Rating
              size="small"
              value={rating}
              disabled
              precision={0.5}
              style={{ color: "#ff5757", marginLeft: "-2px" }}
            />
          </div>
          <p className="mt-[1em]">{truncateText(about, 80)}</p>
        </div>
      </div>
    </div>
  );
};

export default Professional;
