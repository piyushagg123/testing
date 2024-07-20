import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const StarRating = ({ stars }) => {
  const ratingStar = Array.from({ length: 5 }, (index) => {
    let number = index + 0.5;
    return (
      <span key={index}>
        {stars >= index + 1 ? (
          <StarIcon className="icon text-[#FFBE28]" />
        ) : stars >= number ? (
          <StarHalfIcon className="icon text-[#FFBE28]" />
        ) : (
          <StarBorderIcon className="icon" />
        )}
      </span>
    );
  });
  return <div className="flex items-center text-[#c7511f]">{ratingStar}</div>;
};

export default StarRating;
