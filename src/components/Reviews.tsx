import StarIcon from "@mui/icons-material/Star";
import { styled, useTheme } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useQuery } from "react-query";
import axios from "axios";
import constants from "../constants";
import reviewImage from "../assets/noReviewsAdded.png";
import { Divider, Snackbar, useMediaQuery } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../context/Login";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedIcon from "@mui/icons-material/Verified";
import ReviewDialog from "./ReviewDialog";

interface user {
  id: number;
}

export interface Review {
  rating_quality: number;
  rating_execution: number;
  rating_behaviour: number;
  body: string;
  user_name: string;
  review_id: number;
  title: string;
  user_id: number;
}

const Reviews: React.FC<user> = ({ id }) => {
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    return;
  }
  const { userDetails } = authContext;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchReviews = async () => {
    let data;
    if (id === -1) {
      const response = await axios.get(
        `${constants.apiBaseUrl}/vendor/auth/reviews`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      data = response.data;
    } else {
      const response = await axios.get(
        `${constants.apiBaseUrl}/vendor/reviews?vendor_id=${id}`
      );
      data = response.data;
    }
    return data.data;
  };

  const handleDialogSubmit = () => {
    refetch(); // Refetch reviews to get the updated list
    setSnackbarOpen(true);
    setSelectedReview(null);
    setIsEditMode(false);
  };

  const { data: reviews, refetch } = useQuery(["reviews", id], fetchReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setIsEditMode(true); // Enable edit mode
    setDialogOpen(true); // Assuming `setDialogOpen` is used to open the dialog
    console.log(review);
  };

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

  const handleDelete = async (reviewId: number) => {
    try {
      await axios.delete(
        `${constants.apiBaseUrl}/vendor/review?review_id=${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      refetch();

      setSnackbarOpen(true);
    } catch (error) {}
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

  const themes = useTheme();

  //device-width > 600px
  const isLargeDevice = useMediaQuery(themes.breakpoints.up("sm"));

  return (
    <>
      <div className=" w-[93vw] lg:w-full">
        <p className="text-base lg:text-xl font-bold">Rating & Reviews</p>
        {reviews?.length > 0 ? (
          <>
            <div className="flex gap-1 items-center text-[green]">
              <VerifiedIcon sx={{ fontSize: 20 }} />
              <p>By verified users only</p>
            </div>
            <div className={`flex flex-col w-full gap-3 mt-1`}>
              <div className="flex md:items-center justify-start gap-2  flex-row">
                <div className="flex flex-col md:items-center justify-center">
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
                  <p className="my-[1em]">What our customers said</p>
                  <div className="flex items-center gap-3">
                    <p className="flex items-center gap-3 justify-between w-[55vw] md:w-[255px]">
                      <p className="flex items-center md:text-sm">
                        Work Quality
                      </p>
                      <BorderLinearProgress
                        variant="determinate"
                        value={averages.quality * 20}
                        sx={{
                          width: isLargeDevice ? "160px" : "30vw",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: `var(--${colors(
                              averages.quality
                            )})`,
                          },
                        }}
                      />
                    </p>
                    <p className="text-[10px]">{averages.quality}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="flex items-center gap-3 justify-between w-[55vw] md:w-[255px]">
                      <p className="flex items-center md:text-sm"> Execution</p>
                      <BorderLinearProgress
                        variant="determinate"
                        value={averages.execution * 20}
                        sx={{
                          width: isLargeDevice ? "160px" : "30vw",
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
                    <p className="flex items-center gap-3 justify-between w-[55vw] md:w-[255px]">
                      <p className="flex items-center md:text-sm">Behaviour</p>
                      <BorderLinearProgress
                        variant="determinate"
                        value={averages.behaviour * 20}
                        sx={{
                          width: isLargeDevice ? "160px" : "30vw",
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

              <p className="font-bold">Customer Reviews ({reviews?.length})</p>
              <div className="flex flex-col gap-9 justify-start w-full">
                {reviews?.map((review: Review) => (
                  <div className="flex items-start gap-2 justify-between">
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
                          <div>
                            {localStorage.getItem("token") &&
                              userDetails?.user_id === review.user_id && (
                                <div>
                                  <button
                                    onClick={() =>
                                      handleDelete(review.review_id)
                                    }
                                  >
                                    <DeleteIcon sx={{ color: "var(--red)" }} />
                                  </button>
                                  <button onClick={() => handleEdit(review)}>
                                    Edit
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                        <p>{review.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-full">
              <div className="flex flex-col items-center justify-center">
                <div>
                  <img src={reviewImage} alt="" className="w-[300px]" />
                </div>
                <p className="mb-[1em]">No reviews added yet by the users</p>
              </div>
            </div>
          </>
        )}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Review deleted successfully"
        key="bottom-center"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <ReviewDialog
        reviewDialogOpen={dialogOpen}
        handleReviewDialogClose={() => {
          setDialogOpen(false);
          handleDialogSubmit();
        }}
        reviewData={selectedReview} // Pass selected review data for editing
        // isEditMode={isEditMode}
        professional="interiorDesigner"
        e={true}
      />
    </>
  );
};

export default Reviews;
