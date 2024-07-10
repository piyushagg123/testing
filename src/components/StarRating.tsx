import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";

const StarRating = ({ stars }) => {
  const ratingStar = Array.from({ length: 5 }, (index) => {
    let number = index + 0.5;
    return (
      <span key={index}>
        {stars >= index + 1 ? (
          <FaStar className="icon text-[#FFBE28]" />
        ) : stars >= number ? (
          <FaStarHalfAlt className="icon text-[#FFBE28]" />
        ) : (
          <AiOutlineStar className="icon" />
        )}
      </span>
    );
  });
  return <div className="flex items-center">{ratingStar}</div>;
};

export default StarRating;
