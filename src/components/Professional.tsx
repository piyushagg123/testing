import React from "react";
import { Rating } from "@mui/material";

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
    <div className="flex gap-8 mb-5 items-center flex-col sm:flex-row mt-3 sm:mt-0 text-text px-4">
      <div>
        <img
          src={img}
          alt="Professional"
          className="h-[192px] w-[300px] sm:w-[342px] rounded-[10px] sm:max-w-[342px]"
        />
      </div>

      <div className="flex mt-4 flex-col justify-center xl:flex-row">
        <div className="w-[270px] md:w-[375px] xl:w-[600px]">
          <div className="flex flex-row gap-2">
            <div className="flex flex-col">
              <p className="font-bold text-lg">{profCat}</p>
              <div className="flex items-center gap-2">
                <Rating name="read-only" value={rating} readOnly />
              </div>
            </div>
          </div>
          <br />
          <p>{about}</p>
        </div>
      </div>
    </div>
  );
};

export default Professional;
