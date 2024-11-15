import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Review } from "./Reviews";
import { useEffect, useState } from "react";
import axios from "axios";
import constants from "../constants";

interface ReviewDialogProps {
  reviewDialogOpen: boolean;
  handleReviewDialogClose: () => void;
  reviewData?: Review | null;
  handleReviewSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  reviewError?: string | null;
  professional?: string;
  editMode?: boolean;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  reviewDialogOpen,
  handleReviewDialogClose,
  handleReviewSubmit,
  loading,
  reviewError,
  professional,
  reviewData,
  editMode,
}) => {
  const [review, setReview] = useState<Review>({
    title: "",
    body: "",
    rating_quality: 0,
    rating_execution: 0,
    rating_behaviour: 0,
    user_name: "",
    review_id: 0,
    user_id: 0,
    rating: 0,
  });
  const theme = useTheme();
  useEffect(() => {
    if (reviewData) {
      setReview({
        title: reviewData.title || "",
        body: reviewData.body || "",
        rating_quality: reviewData.rating_quality || 0,
        rating_execution: reviewData.rating_execution || 0,
        rating_behaviour: reviewData.rating_behaviour || 0,
        user_name: reviewData.user_name || "",
        review_id: reviewData.review_id || 0,
        user_id: reviewData.user_id || 0,
      });
    }
  }, [reviewData]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (professional === "interiorDesigner") {
        await axios.post(
          `${constants.apiBaseUrl}/vendor/review/update`,
          review,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${constants.apiBaseUrl}/financial-advisor/review/update`,
          review,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
    } catch (error) {}
    handleReviewDialogClose();
  };
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (ratingName: string, newValue: number | null) => {
    setReview((prev) => ({ ...prev, [ratingName]: newValue || 0 }));
  };
  // device-width > 900px
  const isLargeDevice = useMediaQuery(theme.breakpoints.up("md"));
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Dialog
        open={reviewDialogOpen}
        onClose={() => handleReviewDialogClose}
        fullScreen={isFullScreen}
      >
        <form onSubmit={editMode ? handleSubmit : handleReviewSubmit}>
          <DialogTitle sx={{ width: isLargeDevice ? "524px" : "70vw" }}>
            Write a review
          </DialogTitle>

          <DialogContent className="flex flex-col gap-4 justify-center items-center">
            {reviewError && (
              <Alert
                severity="error"
                sx={{ width: isLargeDevice ? "524px" : "70vw" }}
              >
                {reviewError}
              </Alert>
            )}
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              size="small"
              name="title"
              defaultValue={reviewData?.title}
              onChange={handleChange}
              fullWidth
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                marginTop: "10px",
                color: "black",
                borderRadius: "4px",
              }}
            />
            <TextField
              id="outlined-multiline-static"
              label="Your review"
              name="body"
              multiline
              defaultValue={reviewData?.body}
              onChange={handleChange}
              rows={4}
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                color: "black",
                borderRadius: "4px",
              }}
              fullWidth
            />
            {professional === "interiorDesigner" ? (
              <>
                <label
                  htmlFor="rating_quality"
                  className="flex w-[70vw] md:w-[524px]"
                >
                  <div className="flex flex-col md:flex-row  w-[250px] justify-between">
                    <p>Quality</p>
                    <Rating
                      name="rating_quality"
                      defaultValue={reviewData?.rating_quality}
                      onChange={(_, newValue) =>
                        handleRatingChange("rating_quality", newValue)
                      }
                    />
                  </div>
                </label>

                <label
                  htmlFor="rating_execution"
                  className="flex w-[70vw] md:w-[524px] "
                >
                  <div className="flex flex-col md:flex-row w-[250px] justify-between">
                    <p>Execution</p>
                    <Rating
                      name="rating_execution"
                      defaultValue={reviewData?.rating_execution}
                      onChange={(_, newValue) =>
                        handleRatingChange("rating_execution", newValue)
                      }
                    />
                  </div>
                </label>

                <label
                  htmlFor="rating_behaviour"
                  className="flex w-[70vw] md:w-[524px] "
                >
                  <div className="flex flex-col md:flex-row w-[250px] justify-between">
                    <p>Behaviour</p>
                    <Rating
                      name="rating_behaviour"
                      defaultValue={reviewData?.rating_behaviour}
                      onChange={(_, newValue) =>
                        handleRatingChange("rating_behaviour", newValue)
                      }
                    />
                  </div>
                </label>
              </>
            ) : (
              <>
                <label htmlFor="rating" className="flex w-[70vw] md:w-[524px] ">
                  <div className="flex flex-col md:flex-row w-[250px] justify-between">
                    <p>Rating</p>
                    <Rating
                      name="rating"
                      defaultValue={reviewData?.rating}
                      onChange={(_, newValue) =>
                        handleRatingChange("rating", newValue)
                      }
                    />
                  </div>
                </label>
              </>
            )}

            <DialogActions
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                padding: 0,
              }}
            >
              <Button
                onClick={handleReviewDialogClose}
                variant="outlined"
                style={{ borderColor: "#000", color: "#000" }}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                style={{ background: "#8c52ff", height: "36px", width: "85px" }}
                loading={loading}
              >
                {loading ? "" : <>Submit</>}
              </LoadingButton>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default ReviewDialog;
