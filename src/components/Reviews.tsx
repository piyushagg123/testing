import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useQuery } from "react-query";
import axios from "axios";
import constants from "../constants";
import reviewImage from "../assets/noReviewsAdded.png";
import { Divider } from "@mui/material";

interface user {
  id: number;
}

interface Review {
  rating_quality: number;
  rating_execution: number;
  rating_behaviour: number;
  body: string;
  user_name: string;
  review_id: number;
  title: string;
}

const Reviews: React.FC<user> = ({ id }) => {
  const fetchReviews = async () => {
    const response = await axios.get(
      `${constants.apiBaseUrl}/vendor/reviews?vendor_id=${id}`
    );

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
      backgroundColor: theme.palette.mode === "light" ? "#14958F" : "#14958F",
    },
  }));

  const colors = (rating: number): string => {
    if (rating <= 1) {
      return "rating-red";
    }
    if (rating > 1 && rating <= 2) {
      return "rating-yellow";
    }
    if (rating > 2 && rating <= 3) {
      return "rating-lightgreen";
    }
    return "rating-green";
  };

  return (
    <>
      {reviews?.length > 0 ? (
        <>
          <div className={`flex flex-col w-full gap-3 mt-1`}>
            <div className="flex items-center justify-start gap-10">
              <div className="flex flex-col items-center justify-center">
                <p className="flex items-center gap-2">
                  <span className="text-[40px]">
                    {(
                      (averages.behaviour +
                        averages.execution +
                        averages.quality) /
                      3
                    ).toFixed(1)}
                  </span>
                  <StarIcon
                    style={{
                      color: colors(
                        (averages.behaviour +
                          averages.execution +
                          averages.quality) /
                          3
                      ),
                    }}
                  />
                </p>
                <p>{reviews.length} verified customers</p>
              </div>
              <Divider orientation="vertical" flexItem />
              <div className="flex flex-col ">
                <br />
                <p>What our customers said</p>
                <br />
                <div className="flex items-center gap-3">
                  <p className="flex items-center gap-3 justify-between w-[293px]">
                    <p className="flex items-center text-sm"> Work Quality</p>
                    <BorderLinearProgress
                      variant="determinate"
                      value={averages.quality * 20}
                      sx={{
                        width: "200px",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: `var(--${colors(averages.quality)})`,
                        },
                      }}
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
                      sx={{
                        width: "200px",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: `var(--${colors(
                            averages.execution
                          )})`,
                        },
                      }}
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
                      sx={{
                        width: "200px",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: `var(--${colors(
                            averages.behaviour
                          )})`,
                        },
                      }}
                    />
                  </p>
                  <p className="text-[10px]">{averages.behaviour}</p>
                </div>
              </div>
            </div>

            <br />
            <div className="flex flex-col gap-9 justify-start w-full">
              {reviews?.map((review: Review) => (
                <div className="flex items-start gap-2">
                  <p
                    className={`flex items-center gap-1  p-[2px] text-white`}
                    style={{
                      backgroundColor: `var(--${colors(
                        (review.rating_behaviour +
                          review.rating_execution +
                          review.rating_quality) /
                          3
                      )})`,
                    }}
                  >
                    {(
                      (review.rating_behaviour +
                        review.rating_execution +
                        review.rating_quality) /
                      3
                    ).toFixed(1)}
                    <StarIcon sx={{ fontSize: "13px" }} />
                  </p>
                  <div>
                    <div className="flex gap-3">
                      <p>{review.user_name}</p>
                      <Divider orientation="vertical" flexItem />
                      <p>{review.title}</p>
                    </div>
                    <p>{review.body}</p>
                  </div>
                </div>
              ))}
            </div>
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
