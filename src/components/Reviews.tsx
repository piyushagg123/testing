import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useQuery } from "react-query";
import axios from "axios";
import constants from "../constants";
import reviewImage from "../assets/noReviewsAdded.png";

interface userid {
  id: number;
}

interface Review {
  rating_quality: number;
  rating_execution: number;
  rating_behaviour: number;
  body: string;
  user_name: string;
  review_id: number;
}

const Reviews: React.FC<userid> = ({ id }) => {
  const fetchReviews = async () => {
    const response = await axios.get(
      `${constants.apiBaseUrl}/vendor/reviews?vendor_id=${id}`
    );
    console.log(response.data);

    return response.data.data;
  };

  const { data: reviews } = useQuery(["reviews", id], fetchReviews);

  const calculateAverages = (reviews: Review[]) => {
    if (reviews.length === 0) return { quality: 0, execution: 0, behaviour: 0 };

    let totalQuality = 0;
    let totalExecution = 0;
    let totalBehaviour = 0;

    reviews.forEach((review) => {
      totalQuality += review.rating_quality;
      totalExecution += review.rating_execution;
      totalBehaviour += review.rating_behaviour;
    });

    const averageQuality = totalQuality / reviews.length;
    const averageExecution = totalExecution / reviews.length;
    const averageBehaviour = totalBehaviour / reviews.length;

    return {
      quality: averageQuality,
      execution: averageExecution,
      behaviour: averageBehaviour,
    };
  };

  const averages = reviews
    ? calculateAverages(reviews)
    : { quality: 0, execution: 0, behaviour: 0 };

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#8c52ff" : "#8c52ff",
    },
  }));
  return (
    <>
      {reviews?.length > 0 ? (
        <>
          <p className="mt-5"></p>
          <div className="flex  justify-around gap-10">
            <div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="flex items-center gap-2">
                    <span className="text-[25px]">4 </span>
                    <StarIcon />
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-3">
                    <p className="flex items-center">
                      {" "}
                      5 <StarIcon sx={{ fontSize: "15px" }} />
                    </p>
                    <BorderLinearProgress
                      variant="determinate"
                      value={90}
                      sx={{ width: "200px" }}
                    />
                    <p className="text-[10px]">100</p>
                  </p>
                  <p className="flex items-center gap-3">
                    <p className="flex items-center">
                      {" "}
                      4 <StarIcon sx={{ fontSize: "15px" }} />
                    </p>
                    <BorderLinearProgress
                      variant="determinate"
                      value={90}
                      sx={{ width: "200px" }}
                    />
                    <p className="text-[10px]">100</p>
                  </p>
                  <p className="flex items-center gap-3">
                    <p className="flex items-center">
                      {" "}
                      3 <StarIcon sx={{ fontSize: "15px" }} />
                    </p>
                    <BorderLinearProgress
                      variant="determinate"
                      value={90}
                      sx={{ width: "200px" }}
                    />
                    <p className="text-[10px]">100</p>
                  </p>
                  <p className="flex items-center gap-3">
                    <p className="flex items-center">
                      {" "}
                      2 <StarIcon sx={{ fontSize: "15px" }} />
                    </p>
                    <BorderLinearProgress
                      variant="determinate"
                      value={90}
                      sx={{ width: "200px" }}
                    />
                    <p className="text-[10px]">100</p>
                  </p>
                  <p className="flex items-center gap-3">
                    <p className="flex items-center">
                      {" "}
                      1 <StarIcon sx={{ fontSize: "15px" }} />
                    </p>
                    <BorderLinearProgress
                      variant="determinate"
                      value={90}
                      sx={{ width: "200px" }}
                    />
                    <p className="text-[10px]">100</p>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-max">
              <br />
              <p>What our customers said</p>
              <br />
              <div className="flex items-center gap-3">
                <p className="flex items-center gap-3 justify-between w-[293px]">
                  <p className="flex items-center text-sm"> Work Quality</p>
                  <BorderLinearProgress
                    variant="determinate"
                    value={averages.quality * 20}
                    sx={{ width: "200px" }}
                  />
                </p>
                <p className="text-[10px]">{averages.quality}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="flex items-center gap-3 justify-between w-[293px]">
                  <p className="flex items-center text-sm"> Execution</p>
                  <BorderLinearProgress
                    variant="determinate"
                    value={averages.execution * 20}
                    sx={{ width: "200px" }}
                  />
                </p>
                <p className="text-[10px]">{averages.execution}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="flex items-center gap-3 justify-between w-[293px]">
                  <p className="flex items-center text-sm">Behaviour</p>
                  <BorderLinearProgress
                    variant="determinate"
                    value={averages.behaviour * 20}
                    sx={{ width: "200px" }}
                  />
                </p>
                <p className="text-[10px]">{averages.behaviour}</p>
              </div>
            </div>

            <br />
          </div>
          <br />
          <br />
          <div className="flex flex-col gap-9 justify-start w-full">
            {reviews?.map((review: Review) => (
              <div className="flex items-start gap-2">
                <p className="flex items-center gap-1 bg-purple p-[2px] text-white">
                  {(
                    (review.rating_behaviour +
                      review.rating_execution +
                      review.rating_quality) /
                    3
                  ).toFixed(2)}
                  <StarIcon sx={{ fontSize: "13px" }} />
                </p>
                <div>
                  <p>{review.body}</p>
                  <p className="text-sm text-darkgrey">{review.user_name}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap">
            <div className="flex flex-col items-center justify-center">
              <div>
                <img src={reviewImage} alt="" className="w-[300px]" />
              </div>
              <br />
              <p className="">No reviews added yet by the users</p>
              <br />
            </div>
          </div>{" "}
        </>
      )}
    </>
  );
};

export default Reviews;
