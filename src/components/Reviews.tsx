import { useQuery } from "react-query";
import axios from "axios";
import constants from "../constants";
import { NoReviewAdded } from "../assets";
import {
  Divider,
  Snackbar,
  useMediaQuery,
  LinearProgress,
  linearProgressClasses,
  styled,
  useTheme,
} from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../context/Login";
import { Delete, Verified, Edit, Star } from "@mui/icons-material";
import ReviewDialog from "./ReviewDialog";

interface Vendor {
  id: number;
  vendorType?: string;
}

export interface Review {
  rating_quality?: number;
  rating_execution?: number;
  rating_behaviour?: number;
  body: string;
  user_name?: string;
  review_id: number;
  title: string;
  user_id: number;

  rating?: number;
  first_name?: string;
  last_name?: string;
}

type InteriorDesignerRating = {
  quality: number;
  execution: number;
  behaviour: number;
};

const Reviews: React.FC<Vendor> = ({ id, vendorType }) => {
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
    if (vendorType) {
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
    } else {
      const response = await axios.get(
        `${constants.apiBaseUrl}/financial-advisor/reviews?financial_advisor_id=${id}`
      );
      data = response.data;
    }
    return data.data;
  };

  const handleDialogSubmit = () => {
    refetch();
    setSelectedReview(null);
  };

  const { data: reviews, refetch } = useQuery(["reviews", id], fetchReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  const calculateAverages = (reviews: Review[]) => {
    if (reviews.length === 0) {
      return vendorType === "interiorDesigner"
        ? { quality: 0, execution: 0, behaviour: 0 }
        : 0;
    }

    if (vendorType === "interiorDesigner") {
      let totalQuality = 0;
      let totalExecution = 0;
      let totalBehaviour = 0;

      reviews.forEach((review) => {
        totalQuality += review.rating_quality || 0;
        totalExecution += review.rating_execution || 0;
        totalBehaviour += review.rating_behaviour || 0;
      });

      return {
        quality: totalQuality / reviews.length,
        execution: totalExecution / reviews.length,
        behaviour: totalBehaviour / reviews.length,
      };
    } else {
      let totalRating = 0;

      reviews.forEach((review) => {
        totalRating += review.rating || 0;
      });

      return totalRating / reviews.length;
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      if (vendorType === "interiorDesigner") {
        await axios.delete(
          `${constants.apiBaseUrl}/vendor/review?review_id=${reviewId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.delete(
          `${constants.apiBaseUrl}/financial-advisor/review?review_id=${reviewId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

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
              <Verified sx={{ fontSize: 20 }} />
              <p>By verified users only</p>
            </div>
            <div className={`flex flex-col w-full gap-3 mt-1`}>
              <div className="flex md:items-center justify-start gap-2  flex-row">
                <div className="flex flex-col md:items-center justify-center">
                  <p className="flex items-center gap-2">
                    <span className="text-[40px]">
                      {vendorType === "interiorDesigner"
                        ? (
                            ((averages as InteriorDesignerRating).behaviour +
                              (averages as InteriorDesignerRating).execution +
                              (averages as InteriorDesignerRating).quality) /
                            3
                          ).toFixed(1)
                        : (averages as number).toFixed(1)}
                    </span>
                    <Star
                      style={{
                        color: colors(
                          vendorType === "interiorDesigner"
                            ? ((averages as InteriorDesignerRating).behaviour +
                                (averages as InteriorDesignerRating).execution +
                                (averages as InteriorDesignerRating).quality) /
                                3
                            : (averages as number)
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
                        {vendorType === "interiorDesigner"
                          ? "Work Quality"
                          : "Rating"}
                      </p>
                      <BorderLinearProgress
                        variant="determinate"
                        value={
                          vendorType === "interiorDesigner"
                            ? (averages as InteriorDesignerRating).quality * 20
                            : (averages as number) * 20
                        }
                        sx={{
                          width: isLargeDevice ? "160px" : "30vw",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: `var(--${colors(
                              (averages as InteriorDesignerRating).quality
                            )})`,
                          },
                        }}
                      />
                    </p>
                    <p className="text-[10px]">
                      {(averages as InteriorDesignerRating).quality}
                    </p>
                  </div>
                  {vendorType === "interiorDesigner" && (
                    <>
                      <div className="flex items-center gap-3">
                        <p className="flex items-center gap-3 justify-between w-[55vw] md:w-[255px]">
                          <p className="flex items-center md:text-sm">
                            {" "}
                            Execution
                          </p>
                          <BorderLinearProgress
                            variant="determinate"
                            value={
                              (averages as InteriorDesignerRating).execution *
                              20
                            }
                            sx={{
                              width: isLargeDevice ? "160px" : "30vw",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: `var(--${colors(
                                  (averages as InteriorDesignerRating).execution
                                )})`,
                              },
                            }}
                          />
                        </p>
                        <p className="text-[10px]">
                          {(averages as InteriorDesignerRating).execution}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="flex items-center gap-3 justify-between w-[55vw] md:w-[255px]">
                          <p className="flex items-center md:text-sm">
                            Behaviour
                          </p>
                          <BorderLinearProgress
                            variant="determinate"
                            value={
                              (averages as InteriorDesignerRating).behaviour *
                              20
                            }
                            sx={{
                              width: isLargeDevice ? "160px" : "30vw",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: `var(--${colors(
                                  (averages as InteriorDesignerRating).behaviour
                                )})`,
                              },
                            }}
                          />
                        </p>
                        <p className="text-[10px]">
                          {(averages as InteriorDesignerRating).behaviour}
                        </p>
                      </div>
                    </>
                  )}
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
                            vendorType === "interiorDesigner"
                              ? (review.rating_behaviour! +
                                  review.rating_execution! +
                                  review.rating_quality!) /
                                  3
                              : (averages as number)
                          )})`,
                        }}
                      >
                        {vendorType === "interiorDesigner"
                          ? (
                              (review.rating_behaviour! +
                                review.rating_execution! +
                                review.rating_quality!) /
                              3
                            ).toFixed(1)
                          : review?.rating?.toFixed(1)}
                        <Star sx={{ fontSize: "13px" }} />
                      </p>
                      <div>
                        <div className="flex gap-3">
                          {vendorType === "interiorDesigner" ? (
                            <p>{review.user_name}</p>
                          ) : (
                            <p>
                              {review.first_name} {review.last_name}
                            </p>
                          )}
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
                                    <Delete sx={{ color: "var(--red)" }} />
                                  </button>
                                  <button onClick={() => handleEdit(review)}>
                                    <Edit />
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
                  <img src={NoReviewAdded} alt="" className="w-[300px]" />
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
        message={"Review deleted successfully"}
        key="bottom-center"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <ReviewDialog
        reviewDialogOpen={dialogOpen}
        handleReviewDialogClose={() => {
          setDialogOpen(false);
          handleDialogSubmit();
        }}
        reviewData={selectedReview}
        professional={
          vendorType === "interiorDesigner"
            ? "interiorDesigner"
            : "financeAdvisor"
        }
        editMode={true}
      />
    </>
  );
};

export default Reviews;
