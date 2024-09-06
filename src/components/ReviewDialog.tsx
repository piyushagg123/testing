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

interface ReviewDialogProps {
  reviewDialogOpen: boolean;
  handleReviewDialogClose: () => void;
  handleReviewSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  reviewError?: string | null;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  reviewDialogOpen,
  handleReviewDialogClose,
  handleReviewSubmit,
  loading,
  reviewError,
}) => {
  return (
    <Dialog open={reviewDialogOpen} onClose={() => handleReviewDialogClose}>
      <form onSubmit={handleReviewSubmit}>
        <DialogTitle>Write a review</DialogTitle>

        <DialogContent className="flex flex-col gap-4 justify-center items-center">
          {reviewError && (
            <Alert severity="error" sx={{ width: "35vw" }}>
              {reviewError}
            </Alert>
          )}
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            size="small"
            name="title"
            fullWidth
            sx={{
              width: "35vw",
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
            rows={4}
            sx={{
              width: "35vw",
              color: "black",
              borderRadius: "4px",
            }}
            fullWidth
          />
          <label htmlFor="rating_quality" className="flex w-[524px]">
            <div className="flex w-[250px] justify-between">
              <p>Quality</p>
              <Rating name="rating_quality" />
            </div>
          </label>

          <label htmlFor="rating_execution" className="flex w-[524px] ">
            <div className="flex w-[250px] justify-between">
              <p>Execution</p>
              <Rating name="rating_execution" />
            </div>
          </label>

          <label htmlFor="rating_behaviour" className="flex w-[524px] ">
            <div className="flex w-[250px] justify-between">
              <p>Behaviour</p>
              <Rating name="rating_behaviour" />
            </div>
          </label>

          <DialogActions
            sx={{
              width: "35vw",
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
              style={{ background: "#8c52ff", height: "36px" }}
              loading={loading}
            >
              {loading ? "" : <>Submit</>}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default ReviewDialog;
