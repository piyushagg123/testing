import { FormEvent, useContext, useEffect, useState } from "react";
import img from "../../assets/noImageinProject.jpg";
import {
  OpenInNew,
  StarBorder,
  Facebook,
  Instagram,
} from "@mui/icons-material";
import { Chip, Button, Snackbar } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import constants from "../../constants";
import { AuthContext } from "../../context/Login";
import { ReviewDialog, Reviews } from "../../components";
import { ProfessionalInfoProps } from "./Types";
import { fetchFinancialAdvisorDetails, submitReview } from "./Controller";
import {
  removeUnderscoresAndFirstLetterCapital,
  truncateText,
} from "../../helpers/StringHelpers";

const FinancePlannerInfo: React.FC<ProfessionalInfoProps> = ({
  renderProfessionalInfoView,
}) => {
  const authContext = useContext(AuthContext);

  if (authContext === undefined) {
    return;
  }
  const { login, userDetails } = authContext;
  const { professionalId } = useParams();

  const { data: vendorData, isLoading: isVendorLoading } = useQuery(
    ["vendorDetails", professionalId],
    () => fetchFinancialAdvisorDetails(professionalId!)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleReviewDialogOpen = () => {
    setReviewDialogOpen(true);
  };

  const handleReviewDialogClose = (
    _?: React.SyntheticEvent<Element, Event>,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) {
      return;
    }
    setReviewDialogOpen(false);
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

  const isMobile = window.innerWidth < 1024;
  const maxVisibleLength = 100;

  const contentPreview =
    isMobile && !expanded
      ? truncateText(vendorData?.description!, maxVisibleLength)
      : vendorData?.description;
  const professionalCard = (
    <div className=" text-[12px] md:text-[16px]  lg:ml-6 lg:mt-7 flex-col flex lg:block gap-4 items-center p-2">
      <div className="flex flex-row lg:flex-col w-full">
        <div className="mt-[1em] lg:mt-0 w-1/2 lg:w-fit">
          <p className="font-bold  text-black">AUM handled</p>
          <p className="">{vendorData?.aum_handled ?? "N/A"}</p>
        </div>
        <div className="mt-[1em] w-1/2 lg:w-fit">
          <p className="font-bold  text-black">Sebi registered</p>
          <p className="">{vendorData?.sebi_registered?.toString() ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row lg:flex-col ">
        <div className="w-1/2 lg:w-fit mt-[1em]">
          <p className="font-bold  text-black">Fees type</p>
          <p className="">{vendorData?.fees_type ?? "N/A"}</p>
        </div>
        <div className=" w-1/2 lg:w-fit mt-[1em]">
          <p className="font-bold  text-black">Fees</p>
          <p className="">{vendorData?.fees ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row lg:flex-col ">
        <div className="w-1/2 lg:w-fit mt-[1em]">
          <p className="font-bold  text-black">Minimum investment</p>
          <p className="">{vendorData?.minimum_investment ?? "N/A"}</p>
        </div>
        <div className=" w-1/2 lg:w-fit mt-[1em]">
          <p className="font-bold  text-black">Number of employees</p>
          <p className="">{vendorData?.number_of_employees ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row lg:flex-col ">
        <div className="w-1/2 lg:w-fit mt-[1em]">
          <p className="font-bold  text-black">Number of clients</p>
          <p className="">{vendorData?.number_of_clients ?? "N/A"}</p>
        </div>
        <div className=" w-1/2 lg:w-fit mt-[1em]">
          <p className="font-bold  text-black">Location</p>
          <p className="">{vendorData?.city ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex flex-row lg:flex-col  w-full">
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
        <div className="w-1/2 lg:w-fit">
          <p className="font-bold text-black mt-[1em]">Contact Number</p>
          <p className="">{vendorData?.mobile ?? "N/A"}</p>
        </div>
      </div>
      <div className="w-full mt-[1em]">
        <p className="font-bold  text-black">Email</p>
        <p className="">{vendorData?.email ?? "N/A"}</p>
      </div>
      <div className="lg:hidden w-full ">
        <p className="font-bold  text-black">About</p>
        <p className=" text-justify mb-[1em] rounded-md">
          {contentPreview}
          {isMobile && vendorData?.description.length! > maxVisibleLength && (
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

  if (isVendorLoading) return <div className="min-h-screen">Loading...</div>;
  return (
    <>
      <div className="mt-[70px] text-text flex flex-col lg:flex-row  justify-center  min-h-screen">
        <div className="text-[10px] md:text-[16px] flex flex-col gap-7 md:gap-0">
          <div className=" md:w-max m-auto lg:m-0 my-[2em]">
            {professionalHeader}

            <div className="lg:hidden flex justify-center">
              {isMobile ? (
                <div className="border border-1 rounded-md border-[#d3d8e0] w-[93vw]">
                  {professionalCard}
                </div>
              ) : (
                <div className="">{professionalCard}</div>
              )}
            </div>

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
            <div id="reviews" className=" mb-[10px] w-[98vw] m-auto">
              <div className=" lg:w-[750px] flex justify-center flex-col items-center px-2">
                {
                  <Reviews
                    id={professionalId ? Number(professionalId) : Number(-1)}
                  />
                }
              </div>
            </div>
          </div>
        </div>

        <ReviewDialog
          handleReviewDialogClose={handleReviewDialogClose}
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
    </>
  );
};

export default FinancePlannerInfo;
