import { FormEvent, useContext, useEffect, useState } from "react";
import { NoLogoUploaded } from "../../assets";
import {
  OpenInNew,
  StarBorder,
  Facebook,
  Instagram,
} from "@mui/icons-material";
import {
  Chip,
  Dialog,
  DialogContent,
  Button,
  Snackbar,
  useMediaQuery,
  useTheme,
  DialogTitle,
  Alert,
  TextField,
  DialogActions,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import constants from "../../constants";
import { AuthContext } from "../../context/index";
import { LoadingButton } from "@mui/lab";
import { ProfessionalInfoProps } from "./Types";
import { fetchFinancialAdvisorDetails, submitReview } from "./Controller";
import {
  removeUnderscoresAndFirstLetterCapital,
  truncateText,
} from "../../helpers/StringHelpers";
import { ReviewDialog, Reviews } from "../../components";

const FinancePlannerInfoLaptop: React.FC<ProfessionalInfoProps> = ({
  renderProfessionalInfoView,
  vendor_id,
}) => {
  const authContext = useContext(AuthContext);

  if (authContext === undefined) {
    return;
  }
  const { login, userDetails } = authContext;
  const { professionalId } = useParams();

  const { data: vendorData, isLoading: isVendorLoading } = useQuery(
    ["vendorDetails", professionalId],
    () =>
      fetchFinancialAdvisorDetails(
        vendor_id ? vendor_id.toString() : professionalId!
      )
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleReviewDialogOpen = () => {
    setReviewDialogOpen(true);
  };

  const handleDialogClose = (
    _?: React.SyntheticEvent<Element, Event>,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) {
      return;
    }
    setCourseDialogOpen(false);
    setServiceDialogOpen(false);
    setReviewError("");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    submitReview(
      event,
      professionalId!,
      () => {
        setReviewDialogOpen(false);
        setSnackbarOpen(true);
      },
      (errorMessage) => {
        setReviewError(errorMessage);
      }
    );
    setLoading(false);
  };

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const maxVisibleLength = 100;

  const contentPreview = !expanded
    ? truncateText(vendorData?.description!, maxVisibleLength)
    : vendorData?.description;
  const professionalCard = (
    <div className=" text-[12px] md:text-[16px]  lg:ml-6 lg:mt-7 flex-col flex lg:block gap-4 items-center p-2 lg:border lg:rounded-md">
      <div className="flex flex-row w-full">
        <div className="mt-[1em]  w-1/2 ">
          <p className="font-bold  text-black">AUM handled</p>
          <p className="">₹{vendorData?.aum_handled ?? "N/A"}</p>
        </div>
        <div className="mt-[1em] w-1/2 ">
          <p className="font-bold  text-black">Sebi registered</p>
          <p className="">{vendorData?.sebi_registered?.toString() ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row ">
        <div className=" w-1/2 mt-[1em]">
          <p className="font-bold  text-black"> Fees</p>
          <p className="flex">
            {vendorData?.fees_type && vendorData.fees_type[0] === "FIXED" && (
              <p className="mr-1">{"₹"}</p>
            )}
            {vendorData?.fees ?? "N/A"}

            {vendorData?.fees_type &&
              vendorData.fees_type[0] === "PERCENTAGE" && (
                <p className="ml-1">{"%"}</p>
              )}
          </p>
        </div>
        <div className="w-1/2 mt-[1em]">
          <p className="font-bold  text-black">Minimum investment</p>
          <p className="">₹{vendorData?.minimum_investment ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row ">
        <div className=" w-1/2 mt-[1em]">
          <p className="font-bold  text-black">Number of employees</p>
          <p className="">{vendorData?.number_of_employees ?? "N/A"}</p>
        </div>
        <div className="w-1/2 mt-[1em]">
          <p className="font-bold  text-black">Number of clients</p>
          <p className="">{vendorData?.number_of_clients ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row">
        <div className=" w-1/2 mt-[1em]">
          <p className="font-bold  text-black">Location</p>
          <p className="">{vendorData?.city ?? "N/A"}</p>
        </div>
        <div className="w-1/2 ">
          <p className="font-bold text-black mt-[1em]">Contact Number</p>
          <p className="">{vendorData?.mobile ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex flex-row  w-full">
        {(vendorData?.social?.facebook ||
          vendorData?.social?.instagram ||
          vendorData?.social?.website) && (
          <div className="w-1/2 mt-[1em]">
            <p className="font-bold  text-black">Socials</p>
            {vendorData.social.facebook && (
              <a
                href={vendorData.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook />
              </a>
            )}
            {vendorData.social.instagram && (
              <a
                href={vendorData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram />
              </a>
            )}
            {vendorData.social.website && (
              <a
                href={vendorData.social.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <OpenInNew />
              </a>
            )}
          </div>
        )}
      </div>
      <div className="w-full mt-[1em]">
        <p className="font-bold  text-black">Email</p>
        <p className="">{vendorData?.email ?? "N/A"}</p>
      </div>
      <div className=" w-full mt-[1em]">
        <p className="font-bold  text-black">About</p>
        <p className=" text-justify mb-[1em] rounded-md">
          {contentPreview}
          {vendorData?.description.length! > maxVisibleLength && (
            <button
              onClick={handleExpandClick}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              {expanded ? "Read less" : "Read More"}
            </button>
          )}
        </p>
      </div>
    </div>
  );

  const professionalHeader = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-center lg:justify-start   lg:items-start gap-3 md:mt-[2em] mb-[1em] w-[93vw] md:w-auto mx-auto">
      <div className="m-auto md:m-0 flex flex-col md:justify-center items-center">
        {vendorData?.logo ? (
          <img
            src={`${constants.apiImageUrl}/${vendorData.logo}`}
            alt="Vendor Logo"
            className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full"
          />
        ) : (
          <img
            src={NoLogoUploaded}
            alt=""
            className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full"
          />
        )}
        <p className="font-semibold text-base text-black text-center md:text-left mx-3 md:hidden">
          {removeUnderscoresAndFirstLetterCapital(
            vendorData?.business_name ?? "Unknown Business"
          )}
        </p>
      </div>
      <div className="w-[93vw] md:w-auto">
        <p className="font-semibold text-base text-black text-center md:text-left hidden md:block">
          {removeUnderscoresAndFirstLetterCapital(
            vendorData?.business_name ?? "Unknown Business"
          )}
        </p>
        <div className="mb-2 mt-2 flex flex-col md:flex-row gap-2 items-start md:items-center">
          <span className="font-bold text-[11px] md:text-sm text-black">
            DEALS :
          </span>{" "}
          <div className="flex flex-wrap gap-1">
            {vendorData?.deals &&
              Array.isArray(vendorData.deals) &&
              vendorData.deals.map((item, ind) => (
                <Chip
                  label={removeUnderscoresAndFirstLetterCapital(item)}
                  variant="outlined"
                  key={ind}
                  sx={{ height: "20px", fontSize: "11px" }}
                />
              ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
          <span className="font-bold text-[11px] md:text-sm text-black">
            INVESTMENT IDEOLOGY :
          </span>
          <div className="flex flex-wrap gap-1">
            {vendorData?.investment_ideology &&
              Array.isArray(vendorData.investment_ideology) &&
              vendorData.investment_ideology.map((item, ind) => (
                <Chip
                  label={removeUnderscoresAndFirstLetterCapital(item)}
                  variant="outlined"
                  key={ind}
                  sx={{ height: "20px", fontSize: "11px" }}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
  const theme = useTheme();

  // device-width > 900px
  const isLargeDevice = useMediaQuery(theme.breakpoints.up("md"));
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  if (isVendorLoading) return <div className="min-h-screen">Loading...</div>;
  return (
    <>
      <div className="mt-16 px-16 flex">
        <div className="w-[60%]">
          {professionalHeader}
          <div className=" md:w-max m-auto lg:m-0 my-[2em]">
            {login && userDetails?.vendor_id !== Number(professionalId) && (
              <div className=" gap-3 hidden md:flex mb-[2em]">
                <div>
                  {renderProfessionalInfoView && (
                    <Button
                      variant="outlined"
                      style={{ backgroundColor: "#8c52ff", color: "white" }}
                      onClick={handleReviewDialogOpen}
                    >
                      <StarBorder /> <p>Write a Review</p>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          <br />
        </div>

        <div className="h-fit w-[40%] flex flex-col">
          {professionalCard}
          <br />

          <div id="reviews" className=" mb-[10px]  m-auto ml-6">
            <div className=" flex justify-center flex-col items-center px-2">
              {<Reviews id={Number(professionalId)} />}
            </div>
          </div>
        </div>
        <ReviewDialog
          handleReviewDialogClose={handleDialogClose}
          handleReviewSubmit={handleReviewSubmit}
          loading={loading}
          reviewDialogOpen={reviewDialogOpen}
          reviewError={reviewError}
          professional="financePlanner"
        />
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="Review submitted successfully!"
        key="bottom-center"
        autoHideDuration={3000}
      />

      <Dialog
        open={courseDialogOpen}
        onClose={() => handleDialogClose}
        fullScreen={isFullScreen}
      >
        <form>
          <DialogTitle sx={{ width: isLargeDevice ? "524px" : "70vw" }}>
            Add a course
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
              fullWidth
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                marginTop: "10px",
                color: "black",
                borderRadius: "4px",
              }}
            />

            <div className="flex justify-between w-[524px]">
              <TextField
                id="outlined-basic"
                label="Duration"
                variant="outlined"
                size="small"
                name="title"
                fullWidth
                sx={{
                  width: isLargeDevice ? "245px" : "70vw",
                  marginTop: "10px",
                  color: "black",
                  borderRadius: "4px",
                }}
              />
              <TextField
                id="outlined-basic"
                label="Cost"
                variant="outlined"
                size="small"
                name="title"
                fullWidth
                sx={{
                  width: isLargeDevice ? "245px" : "70vw",
                  marginTop: "10px",
                  color: "black",
                  borderRadius: "4px",
                }}
              />
            </div>
            <TextField
              id="outlined-multiline-static"
              label="Description"
              name="body"
              multiline
              rows={4}
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                color: "black",
                borderRadius: "4px",
              }}
              fullWidth
            />

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
                onClick={handleDialogClose}
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

      <Dialog
        open={serviceDialogOpen}
        onClose={() => handleDialogClose}
        fullScreen={isFullScreen}
      >
        <form>
          <DialogTitle sx={{ width: isLargeDevice ? "524px" : "70vw" }}>
            Add a service
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
              fullWidth
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                marginTop: "10px",
                color: "black",
                borderRadius: "4px",
              }}
            />

            <div className="flex justify-between w-[524px]">
              <TextField
                id="outlined-basic"
                label="Duration"
                variant="outlined"
                size="small"
                name="title"
                fullWidth
                sx={{
                  width: isLargeDevice ? "245px" : "70vw",
                  marginTop: "10px",
                  color: "black",
                  borderRadius: "4px",
                }}
              />
              <TextField
                id="outlined-basic"
                label="Cost"
                variant="outlined"
                size="small"
                name="title"
                fullWidth
                sx={{
                  width: isLargeDevice ? "245px" : "70vw",
                  marginTop: "10px",
                  color: "black",
                  borderRadius: "4px",
                }}
              />
            </div>
            <TextField
              id="outlined-multiline-static"
              label="Description"
              name="body"
              multiline
              rows={4}
              sx={{
                width: isLargeDevice ? "524px" : "70vw",
                color: "black",
                borderRadius: "4px",
              }}
              fullWidth
            />

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
                onClick={handleDialogClose}
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

export default FinancePlannerInfoLaptop;