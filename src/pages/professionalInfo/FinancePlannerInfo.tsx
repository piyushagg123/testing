import { FormEvent, useContext, useState } from "react";
import img from "../../assets/noImageinProject.jpg";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import {
  Chip,
  Tab,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Snackbar,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import constants from "../../constants";
import { AuthContext } from "../../context/Login";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Reviews from "../../components/Reviews";
import ReviewDialog from "../../components/ReviewDialog";
import AddAProject from "../../components/AddAProject";
import ProjectImages from "../../components/ProjectImages";
import CloseIcon from "@mui/icons-material/Close";

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
  rating_quality?: number;
  rating_execution?: number;
  rating_behaviour?: number;
  vendor_id?: number;
}

interface ProfessionalInfoProps {
  renderProfileView: boolean;
  renderProfessionalInfoView: boolean;
}

const fetchVendorDetails = async (id: string) => {
  let data;

  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advisor/details?financial_advisor_id=${id}`
  );
  data = response.data;

  return data.data as VendorData;
};

const FinancePlannerInfo: React.FC<ProfessionalInfoProps> = ({
  renderProfessionalInfoView,
}) => {
  const authContext = useContext(AuthContext);

  if (authContext === undefined) {
    return;
  }
  const { login, userDetails } = authContext;
  const { professionalId } = useParams();

  const [value, setValue] = useState("1");
  const { data: vendorData, isLoading: isVendorLoading } = useQuery(
    ["vendorDetails", professionalId],
    () => fetchVendorDetails(professionalId!)
  );

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [projectId, setProjectId] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setIsSubmitted(false);
    setSelectedSubCategories([]);
  };

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
  const formatCategory = (str: string) => {
    let formattedStr = str.replace(/_/g, " ");
    formattedStr = formattedStr
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedStr;
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    const formObject: ReviewFormObject = { vendor_id: Number(professionalId) };
    formData.forEach((value, key) => {
      if (key.startsWith("rating_")) {
        (formObject[
          key as "rating_quality" | "rating_execution" | "rating_behaviour"
        ] as number) = Number(value);
      } else {
        formObject[key as "body"] = value.toString();
      }
    });

    try {
      await axios.post(`${constants.apiBaseUrl}/vendor/review`, formObject, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      handleReviewDialogClose();
      setSnackbarOpen(true);
    } catch (error: any) {
      setReviewError(error.response.data.debug_info);
    }
    setLoading(false);
    setValue("1");
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
    <div className=" text-[12px] md:text-[16px]  lg:ml-6 lg:mt-10 flex-col flex lg:block gap-4 items-center p-2">
      <div className="flex flex-row lg:flex-col w-full">
        <div className="mt-[1em] w-1/2 lg:w-fit">
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

  if (isVendorLoading) return <div className="min-h-screen">Loading...</div>;
  return (
    <>
      <div className="mt-[70px] text-text flex flex-col lg:flex-row  justify-center  min-h-screen">
        <div className="text-[10px] md:text-[16px] flex flex-col gap-7 md:gap-0">
          <div className=" md:w-max m-auto lg:m-0 my-[2em]">
            {/* <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mt-[2em] mb-[1em]">
              <div className="m-auto md:m-0">
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
              </div>
              <div>
                <p className="font-bold text-base text-darkgrey m-auto flex items-center gap-1">
                  {formatCategory(
                    vendorData?.business_name ?? "Unknown Business"
                  )}
                  {professional === "financePlanners" &&
                    vendorData?.sebi_registered && (
                      <VerifiedIcon sx={{ fontSize: "15px" }} />
                    )}
                </p>
                <p className="mb-2 mt-2 flex flex-col md:flex-row gap-2 items-start md:items-center">
                  <span className="font-bold text-sm text-darkgrey">
                    {"DEALS :"}
                  </span>{" "}
                  <div className="flex flex-wrap gap-1">
                    {formatCategory(vendorData?.deals ?? "N/A")
                      .split(",")
                      .map((item, ind) => (
                        <Chip
                          label={item.charAt(0).toUpperCase() + item.slice(1)}
                          variant="outlined"
                          key={ind}
                          sx={{ height: "25px" }}
                        />
                      ))}
                  </div>
                </p>

                <p className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
                  <span className="font-bold text-sm text-darkgrey">
                    {"INVESTMENT IDEOLOGY :"}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {formatCategory(vendorData?.investment_ideology ?? "N/A")
                      .split(",")
                      .map((item, ind) => (
                        <Chip
                          label={item.charAt(0).toUpperCase() + item.slice(1)}
                          variant="outlined"
                          key={ind}
                          sx={{ height: "25px" }}
                        />
                      ))}
                  </div>
                </p>
                <p className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
                  <span className="font-bold text-sm text-darkgrey">
                    {"FEES TYPE :"}
                  </span>
                  {formatCategory(vendorData?.fees_type ?? "N/A")
                    .split(",")
                    .map((item, ind) => (
                      <Chip
                        label={item.charAt(0).toUpperCase() + item.slice(1)}
                        variant="outlined"
                        key={ind}
                        sx={{ height: "25px" }}
                      />
                    ))}
                </p>
              </div>
            </div> */}
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
                      <StarBorderIcon /> <p>Write a Review</p>
                    </Button>
                  )}
                </div>
              </div>
            )}
            {!isMobile ? (
              <>
                <TabContext value={value}>
                  <Box>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                      sx={{
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#8c52ff",
                        },
                        "& .MuiTab-root.Mui-selected": {
                          color: "#8c52ff",
                        },
                        "& .MuiTab-root": {
                          color: "#576375",
                        },
                      }}
                    >
                      <Tab
                        label="About us"
                        value="1"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                      />

                      <Tab
                        label="Reviews"
                        value="2"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                      />
                    </TabList>
                  </Box>
                  <TabPanel value={"1"} sx={{ padding: 0, marginTop: "10px" }}>
                    <div className="w-[95vw] lg:w-[750px]">
                      <p className="text-sm md:text-base text-justify mb-[1em]">
                        {contentPreview}
                        {isMobile &&
                          vendorData?.description.length! >
                            maxVisibleLength && (
                            <button
                              onClick={handleExpandClick}
                              className="text-blue-500 hover:text-blue-700 font-medium"
                            >
                              {expanded ? "Read Less" : "Read More"}
                            </button>
                          )}
                      </p>
                    </div>
                  </TabPanel>
                  <TabPanel value={"2"} sx={{ padding: 0, marginTop: "10px" }}>
                    <div className="w-[95vw] lg:w-[750px] flex justify-center flex-col items-center">
                      {
                        <Reviews
                          id={
                            professionalId ? Number(professionalId) : Number(-1)
                          }
                        />
                      }
                    </div>
                  </TabPanel>
                </TabContext>
              </>
            ) : (
              <>
                <div id="reviews" className=" mb-[10px] w-[98vw] m-auto">
                  <div className=" lg:w-[750px] flex justify-center flex-col items-center px-2">
                    {
                      <Reviews
                        id={
                          professionalId ? Number(professionalId) : Number(-1)
                        }
                      />
                    }
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          {isMobile ? (
            <div className="border border-1  rounded-md border-[#d3d8e0] w-[93vw]">
              {professionalCard}
            </div>
          ) : (
            <div className="">{professionalCard}</div>
          )}
        </div>
        <ReviewDialog
          handleReviewDialogClose={handleReviewDialogClose}
          handleReviewSubmit={handleReviewSubmit}
          loading={loading}
          reviewDialogOpen={reviewDialogOpen}
          reviewError={reviewError}
        />

        <Dialog open={open} fullWidth>
          <DialogContent sx={{ height: "max-content" }}>
            <div className="flex justify-end">
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            {!isSubmitted ? (
              <AddAProject setProjectId={setProjectId} projectId={projectId} />
            ) : (
              <ProjectImages
                subCategories={selectedSubCategories}
                projectId={projectId}
              />
            )}
          </DialogContent>
        </Dialog>
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
