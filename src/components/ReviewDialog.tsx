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
import { useState } from "react";
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
  e?: boolean;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  reviewDialogOpen,
  handleReviewDialogClose,
  handleReviewSubmit,
  loading,
  reviewError,
  professional,
  reviewData,
  e,
}) => {
  const [review, setReview] = useState<Review>({
    title: reviewData?.title || "",
    body: reviewData?.body || "",
    rating_quality: reviewData?.rating_quality || 0,
    rating_execution: reviewData?.rating_execution || 0,
    rating_behaviour: reviewData?.rating_behaviour || 0,
    user_name: reviewData?.user_name || "",
    review_id: reviewData?.review_id || 0,
    user_id: reviewData?.user_id || 0,
  });
  const theme = useTheme();

  const handleSubmit = async () => {
    try {
      // Call update API
      const response = await axios.post(
        `${constants.apiBaseUrl}/vendor/update/review`,
        review,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error updating review", error);
    }
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
      {reviewData && console.log(reviewData)}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => handleReviewDialogClose}
        fullScreen={isFullScreen}
      >
        <form onSubmit={e ? handleSubmit : handleReviewSubmit}>
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
              defaultValue={review.title}
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
              value={review.body}
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
                      value={review.rating_quality}
                      onChange={(event, newValue) =>
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
                      value={review.rating_execution}
                      onChange={(event, newValue) =>
                        handleRatingChange("execution", newValue)
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
                      value={review.rating_behaviour}
                      onChange={(event, newValue) =>
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
                    <Rating name="rating" />
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
