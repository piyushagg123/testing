import { FormEvent, useContext, useEffect, useState } from "react";
import img from "../../assets/noImageinProject.jpg";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
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
import axios from "axios";
import constants from "../../constants";
import { AuthContext } from "../../context/Login";
import { LoadingButton } from "@mui/lab";
import ReviewDialog from "../../components/ReviewDialog";
import FinancePlannerReviews from "../../components/FinancePlannerReviews";

interface VendorData {
  logo?: string;
  deals?: string;
  investment_ideology?: string;
  fees_type?: string;
  fees?: number;
  number_of_clients?: number;
  aum_handled?: number;
  sebi_registered?: boolean;
  minimum_investment?: number;
  description: string;
  business_name: string;
  number_of_employees: number;
  mobile: string;
  email: string;
  city: string;
  social?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

interface ReviewFormObject {
  title?: string;
  body?: string;
  rating?: number;
  financial_advisor_id?: number;
}

interface ProfessionalInfoProps {
  vendor_id?: number;
}

const fetchVendorDetails = async (id: string) => {
  let data;

  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advisor/details?financial_advisor_id=${id}`
  );
  data = response.data;

  return data.data as VendorData;
};

const FinancePlannerInfoLaptop: React.FC<ProfessionalInfoProps> = ({
  vendor_id,
}) => {
  const authContext = useContext(AuthContext);

  if (authContext === undefined) {
    return;
  }
  const { login, userDetails } = authContext;
  const { professionalId } = useParams<{ professionalId: string }>();

  const vendorIdString = vendor_id ? vendor_id.toString() : professionalId;

  const { data: vendorData, isLoading: isVendorLoading } = useQuery(
    ["vendorDetails", professionalId],
    () => fetchVendorDetails(vendorIdString!)
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
  const formatCategory = (str: string) => {
    let formattedStr = str.replace(/_/g, " ");
    formattedStr = formattedStr
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedStr;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    const formObject: ReviewFormObject = {
      financial_advisor_id: Number(professionalId),
    };
    formData.forEach((value, key) => {
      if (key === "rating") {
        (formObject[key as "rating"] as number) = Number(value);
      } else {
        formObject[key as "body"] = value.toString();
      }
    });

    try {
      await axios.post(
        `${constants.apiBaseUrl}/financial-advisor/review`,
        formObject,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      handleDialogClose();
      setSnackbarOpen(true);
    } catch (error: any) {
      setReviewError(error.response.data.debug_info);
    }
    setLoading(false);
  };

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const isMobile = window.innerWidth < 1024;
  const maxVisibleLength = 100;

  const contentPreview =
    isMobile && !expanded && vendorData?.description?.length! > maxVisibleLength
      ? vendorData?.description.slice(0, maxVisibleLength) + "..."
      : vendorData?.description;
  const professionalCard = (
    <div className=" text-[12px] md:text-[16px]  lg:ml-6 lg:mt-7 flex-col flex lg:block gap-4 items-center p-2 lg:border lg:rounded-md">
      <div className="flex flex-row w-full">
        <div className="mt-[1em]  w-1/2 ">
          <p className="font-bold  text-black">AUM handled</p>
          <p className="">{vendorData?.aum_handled ?? "N/A"}</p>
        </div>
        <div className="mt-[1em] w-1/2 ">
          <p className="font-bold  text-black">Sebi registered</p>
          <p className="">{vendorData?.sebi_registered?.toString() ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row ">
        <div className="w-1/2 mt-[1em]">
          <p className="font-bold  text-black">Fees type</p>
          <p className="">{vendorData?.fees_type ?? "N/A"}</p>
        </div>
        <div className=" w-1/2 mt-[1em]">
          <p className="font-bold  text-black">Fees</p>
          <p className="">{vendorData?.fees ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row ">
        <div className="w-1/2 mt-[1em]">
          <p className="font-bold  text-black">Minimum investment</p>
          <p className="">{vendorData?.minimum_investment ?? "N/A"}</p>
        </div>
        <div className=" w-1/2 mt-[1em]">
          <p className="font-bold  text-black">Number of employees</p>
          <p className="">{vendorData?.number_of_employees ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row">
        <div className="w-1/2 mt-[1em]">
          <p className="font-bold  text-black">Number of clients</p>
          <p className="">{vendorData?.number_of_clients ?? "N/A"}</p>
        </div>
        <div className=" w-1/2 mt-[1em]">
          <p className="font-bold  text-black">Location</p>
          <p className="">{vendorData?.city ?? "N/A"}</p>
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
                <FacebookIcon />
              </a>
            )}
            {vendorData.social.instagram && (
              <a
                href={vendorData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </a>
            )}
            {vendorData.social.website && (
              <a
                href={vendorData.social.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <OpenInNewIcon />
              </a>
            )}
          </div>
        )}
        <div className="w-1/2 ">
          <p className="font-bold text-black mt-[1em]">Contact Number</p>
          <p className="">{vendorData?.mobile ?? "N/A"}</p>
        </div>
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
            src={img}
            alt=""
            className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full"
          />
        )}
        <p className="font-semibold text-base text-black text-center md:text-left mx-3 md:hidden">
          {formatCategory(vendorData?.business_name ?? "Unknown Business")}
        </p>
      </div>
      <div className="w-[93vw] md:w-auto">
        <p className="font-semibold text-base text-black text-center md:text-left hidden md:block">
          {formatCategory(vendorData?.business_name ?? "Unknown Business")}
        </p>
        <div className="mb-2 mt-2 flex flex-col md:flex-row gap-2 items-start md:items-center">
          <span className="font-bold text-[11px] md:text-sm text-black">
            DEALS :
          </span>{" "}
          <div className="flex flex-wrap gap-1">
            {formatCategory(vendorData?.deals ?? "N/A")
              .split(",")
              .map((item, ind) => (
                <Chip
                  label={item.charAt(0).toUpperCase() + item.slice(1)}
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
            {formatCategory(vendorData?.investment_ideology ?? "N/A")
              .split(",")
              .map((item, ind) => (
                <Chip
                  label={item.charAt(0).toUpperCase() + item.slice(1)}
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
                  {!vendor_id && (
                    <Button
                      variant="outlined"
                      style={{ backgroundColor: "#8c52ff", color: "white" }}
                      onClick={handleReviewDialogOpen}
                    >
                      <StarBorderIcon /> <p>Write a Review</p>
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
              {<FinancePlannerReviews id={Number(vendorIdString)} />}
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
