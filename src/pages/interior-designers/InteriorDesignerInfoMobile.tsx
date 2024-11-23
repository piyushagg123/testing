import { FormEvent, useContext, useEffect, useState } from "react";
import { NoProjectsAdded, NoLogoUploaded } from "../../assets";
import {
  Tab,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Divider,
  Snackbar,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import {
  Reviews,
  ReviewDialog,
  AddAProject,
  ProjectImages,
  Carousel,
} from "../../components";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import constants from "../../constants";
import { AuthContext } from "../../context/Login";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import {
  OpenInNew,
  StarBorder,
  Facebook,
  Instagram,
} from "@mui/icons-material";
import { ProfessionalInfoProps, ProjectData } from "./Types";
import {
  removeUnderscoresAndFirstLetterCapital,
  truncateText,
} from "../../helpers/StringHelpers";
import {
  fetchVendorDetails,
  fetchVendorProjects,
  submitInteriorDesignerReview,
} from "../../controllers/interior-designers/VendorControllers";

const InteriorDesignerInfoMobile: React.FC<ProfessionalInfoProps> = ({
  vendor_id,
  renderProfessionalInfoView,
}) => {
  const authContext = useContext(AuthContext);

  if (authContext === undefined) {
    return;
  }
  const { login, userDetails } = authContext;
  const { professionalId } = useParams();

  const [selectedProject, setSelectedProject] = useState<ProjectData>();
  const [value, setValue] = useState("1");
  const { data: vendorData, isLoading: isVendorLoading } = useQuery(
    ["vendorDetails", professionalId],
    () => fetchVendorDetails(vendor_id ? vendor_id.toString() : professionalId!)
  );

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery(
    ["vendorProjects", professionalId],
    () =>
      fetchVendorProjects(vendor_id ? vendor_id.toString() : professionalId!)
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
    window.location.reload();
  };

  const [expandedAbout, setExpandedAbout] = useState(false);
  const handleExpandAboutClick = () => {
    setExpandedAbout(!expandedAbout);
  };

  const handleReviewDialogOpen = () => {
    setReviewDialogOpen(true);
  };
  useEffect(() => {
    const handlePopState = (event: any) => {
      if (selectedProject) {
        event.preventDefault();

        setSelectedProject(undefined);
      }
    };

    if (selectedProject) {
      window.history.pushState(null, "", window.location.pathname);
      window.addEventListener("popstate", handlePopState);
    } else {
      window.removeEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [selectedProject]);

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

  const handleCarouselClick = (project: ProjectData) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    setSelectedProject(undefined);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    await submitInteriorDesignerReview(
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedProject]);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const isMobile = window.innerWidth < 1024;
  const maxVisibleLength = 200;

  const contentPreview =
    isMobile && !expanded
      ? truncateText(vendorData?.description!, maxVisibleLength)
      : vendorData?.description;

  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const professionalCard = (
    <div className=" text-[12px] md:text-[16px]  lg:ml-6 lg:mt-10 flex-col flex lg:block gap-4 lg:items-center p-2">
      <>
        <>
          {selectedProject ? (
            <>
              <div className="flex flex-col">
                <p className="font-bold  text-black">Project name</p>
                <p className=" max-w-[300px]">
                  {removeUnderscoresAndFirstLetterCapital(
                    selectedProject.title
                  )}
                </p>
              </div>

              <div className="flex items-center w-full lg:w-auto justify-end lg:block">
                <div className="w-1/2 lg:w-auto">
                  <p className="font-bold  text-black   lg:mt-[1em]">City</p>
                  <p className=" max-w-[300px]">{selectedProject.city}</p>
                </div>
                <div className="w-1/2 lg:w-auto">
                  <p className="font-bold  text-black  lg:mt-[1em]">State</p>
                  <p className=" max-w-[300px]">{selectedProject.state}</p>
                </div>
              </div>
              <div className="flex  w-full lg:w-auto  lg:block justify-end">
                <div className="w-1/2 lg:w-auto">
                  <p className="font-bold  text-black mt-[1em] ">Spaces</p>
                  <p className="flex gap-1">
                    {removeUnderscoresAndFirstLetterCapital(
                      Object.keys(selectedProject.images).join(",")
                    )}
                  </p>
                </div>
                <div className="w-1/2 lg:w-auto">
                  <p className="font-bold  text-black  mt-[1em] w-1/2">Theme</p>
                  <p className="flex gap-1">
                    {removeUnderscoresAndFirstLetterCapital(
                      selectedProject.sub_category_1
                    )}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold  text-black  mt-[1em]">Description</p>
                <p className=" max-w-[300px]">
                  {!expandedAbout &&
                  selectedProject.description.length! > maxVisibleLength
                    ? selectedProject.description.slice(0, maxVisibleLength) +
                      "..."
                    : selectedProject.description}
                  {selectedProject.description.length! > maxVisibleLength && (
                    <button
                      onClick={handleExpandAboutClick}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      {expandedAbout ? "Read less" : "Read More"}
                    </button>
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-row lg:flex-col w-full">
                <div className="mt-[1em] w-1/2 lg:w-fit">
                  <p className="font-bold  text-black">Typical Job Cost</p>
                  <p className="">
                    {vendorData?.average_project_value ?? "N/A"}
                  </p>
                </div>
                <div className="mt-[1em] w-1/2 lg:w-fit">
                  <p className="font-bold  text-black">Number of Employees</p>
                  <p className="">{vendorData?.number_of_employees ?? "N/A"}</p>
                </div>
              </div>
              <div className="flex  w-full flex-row lg:flex-col mt-[1em]">
                <div className="w-1/2 lg:w-fit mt-[1em]">
                  <p className="font-bold  text-black">Projects Completed</p>
                  <p className="">{vendorData?.projects_completed ?? "N/A"}</p>
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
                  <p className="font-bold text-black mt-[1em]">
                    Contact Number
                  </p>
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
                  {isMobile &&
                    vendorData?.description.length! > maxVisibleLength && (
                      <button
                        onClick={handleExpandClick}
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        {expanded ? "Read less" : "Read More"}
                      </button>
                    )}
                </p>
              </div>
            </>
          )}
        </>
      </>
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
            SPECIALIZED THEMES :
          </span>
          <div className="flex flex-wrap gap-1">
            {removeUnderscoresAndFirstLetterCapital(
              vendorData?.sub_category_1 as string
            )
              ?.split(",")
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
            SPECIALIZED SPACES :
          </span>
          <div className="flex flex-wrap gap-1">
            {removeUnderscoresAndFirstLetterCapital(
              vendorData?.sub_category_2 as string
            )
              ?.split(",")
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
            EXECUTION TYPE :
          </span>
          {(vendorData?.sub_category_3 as string)
            ?.split(",")
            .map((item: string, ind: number) => (
              <Chip
                label={
                  item === "DESIGN"
                    ? constants.DESIGN
                    : item === "MATERIAL_SUPPORT"
                    ? constants.MATERIAL_SUPPORT
                    : constants.COMPLETE
                }
                variant="outlined"
                key={ind}
                sx={{
                  height: "20px",
                  fontSize: "11px",
                  maxWidth: "90vw",
                  overflowWrap: "break-word",
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );

  if (isVendorLoading || isProjectsLoading)
    return <div className="min-h-screen">Loading...</div>;
  return (
    <>
      <div className="mt-[55px] text-black flex flex-col lg:flex-row lg:justify-center min-h-screen">
        <div className="text-[10px] md:text-[16px] flex flex-col gap-7 md:gap-0">
          <div className=" md:w-max m-auto lg:m-0 md:mt-[2em]">
            {isMobile && !selectedProject && professionalHeader}

            {isMobile && selectedProject && (
              <div className="flex gap-3 mb-3 items-center">
                <p className="text-base font-bold mt-2 w-[93vw] m-auto">
                  {vendorData?.business_name}
                </p>
              </div>
            )}

            {!isMobile && professionalHeader}

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
              <div className=" gap-3 md:flex mb-[2em]">
                <div className="mt-3 ml-2 lg:ml-0 mt:mt-0">
                  {renderProfessionalInfoView && !selectedProject && (
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
                        label="Projects"
                        value="2"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                        onClick={handleBackClick}
                      />
                      <Tab
                        label="Reviews"
                        value="3"
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
                    {(vendor_id ||
                      Number(professionalId) == userDetails.vendor_id) && (
                      <div
                        className={`${
                          selectedProject ? "hidden" : "flex w-full justify-end"
                        }`}
                      >
                        <Button
                          variant="outlined"
                          style={{
                            backgroundColor: "#8c52ff",
                            color: "white",
                          }}
                          onClick={() => setOpen(true)}
                        >
                          <AddCircleIcon /> Add a new project
                        </Button>
                      </div>
                    )}
                    <div className="max-w-[95vw] overflow-x-auto whitespace-nowrap lg:w-[750px] flex justify-center  gap-1 items-center  md:m-0 ">
                      <div className="flex flex-wrap pt-[1em] mb-[3em]">
                        {!projectsData ? (
                          <div className="flex flex-col items-center justify-center ">
                            <div className="mb-[1em]">
                              <img
                                src={NoProjectsAdded}
                                alt=""
                                className="w-[300px]"
                              />
                            </div>
                            <p className="mb-[1em]">
                              No projects added yet by the designer
                            </p>
                          </div>
                        ) : selectedProject ? (
                          <div className="flex flex-col mt-2">
                            <div className="flex mb-[1em] justify-start gap-60 lg:w-[750px]">
                              <Button
                                variant="outlined"
                                style={{
                                  backgroundColor: "#8c52ff",
                                  color: "white",
                                }}
                                onClick={handleBackClick}
                              >
                                <ArrowBackIcon />
                              </Button>
                            </div>
                            <div className="flex flex-col gap-3 mb-[1em]">
                              <Carousel
                                imageObj={selectedProject.images}
                                showProjectDetails={false}
                                city=""
                                state=""
                                theme=""
                                title=""
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex md:flex-wrap overflow-x-auto whitespace-nowrap lg:w-[740px] justify-center   md:justify-between">
                            {projectsData.map((item, ind) => (
                              <div
                                key={ind}
                                onClick={() => handleCarouselClick(item)}
                                className="mb-4 mr-2 md:mr-0"
                              >
                                <Carousel
                                  key={ind}
                                  imageObj={item.images}
                                  title={item.title}
                                  city={item.city}
                                  state={item.state}
                                  theme={item.sub_category_1}
                                  showProjectDetails={true}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value={"3"} sx={{ padding: 0, marginTop: "10px" }}>
                    <div className="w-[95vw] lg:w-[750px] flex justify-center flex-col items-center">
                      {
                        <Reviews
                          id={
                            professionalId ? Number(professionalId) : Number(-1)
                          }
                          vendorType="interiorDesigner"
                        />
                      }
                    </div>
                  </TabPanel>
                </TabContext>
              </>
            ) : (
              <>
                <div id="projects" className=" mb-[10px]">
                  {!selectedProject && (
                    <p className="text-base font-bold w-[93vw] lg:w-auto m-auto mt-5">
                      Projects
                    </p>
                  )}
                  <div className="w-[93vw] m-auto   lg:w-[750px]   gap-2  pt-[10px] ">
                    <div className="   ">
                      {!projectsData ? (
                        <div className="flex flex-col items-center justify-center w-[90vw]">
                          {(vendor_id ||
                            Number(professionalId) ==
                              userDetails.vendor_id) && (
                            <div
                              className={`${
                                selectedProject
                                  ? "hidden"
                                  : "flex w-full justify-start"
                              }`}
                            >
                              <div
                                className={`${
                                  selectedProject ? "hidden" : "mr-2"
                                } mb-3`}
                              >
                                <Button
                                  variant="outlined"
                                  style={{
                                    color: "#8c52ff",
                                    height: "170px",
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: "10px",
                                    borderColor: "#8c52ff",
                                    textTransform: "none",
                                  }}
                                  onClick={() => setOpen(true)}
                                >
                                  <AddCircleIcon />
                                  <p>Add a project</p>
                                </Button>
                              </div>
                            </div>
                          )}
                          {Number(professionalId) !== userDetails.vendor_id &&
                            !vendor_id && (
                              <>
                                <div className="mb-[1em]">
                                  <img
                                    src={NoProjectsAdded}
                                    alt=""
                                    className="w-[300px]"
                                  />
                                </div>
                                <p className="mb-[1em]">
                                  No projects added yet by the designer
                                </p>
                              </>
                            )}
                        </div>
                      ) : selectedProject ? (
                        <div className="flex flex-col mt-2">
                          <div className="flex flex-col gap-3 mb-[1em]">
                            <Carousel
                              imageObj={selectedProject.images}
                              showProjectDetails={false}
                              city=""
                              state=""
                              theme=""
                              title=""
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex overflow-x-auto whitespace-nowrap lg:w-[750px] items-start ">
                          <div>
                            {(vendor_id ||
                              Number(professionalId) ==
                                userDetails.vendor_id) && (
                              <div
                                className={`${
                                  selectedProject ? "hidden" : "mr-2"
                                } mb-3`}
                              >
                                <Button
                                  variant="outlined"
                                  style={{
                                    color: "#8c52ff",
                                    height: "170px",
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: "10px",
                                    borderColor: "#8c52ff",
                                    textTransform: "none",
                                  }}
                                  onClick={() => setOpen(true)}
                                >
                                  <AddCircleIcon />
                                  <p>Add a project</p>
                                </Button>
                              </div>
                            )}
                          </div>
                          {projectsData.map((item, ind) => (
                            <div
                              key={ind}
                              onClick={() => handleCarouselClick(item)}
                              className="mb-4 mr-2"
                            >
                              <Carousel
                                key={ind}
                                imageObj={item.images}
                                title={item.title}
                                city={item.city}
                                state={item.state}
                                theme={item.sub_category_1}
                                showProjectDetails={true}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {!selectedProject && <Divider />}
                </div>
                {!selectedProject && (
                  <div id="reviews" className=" mb-[10px] w-[98vw] m-auto">
                    <div className=" lg:w-[750px] flex justify-center flex-col items-center px-2">
                      {
                        <Reviews
                          id={
                            professionalId ? Number(professionalId) : Number(-1)
                          }
                          vendorType="interiorDesigner"
                        />
                      }
                    </div>
                  </div>
                )}
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
          professional="interiorDesigner"
        />

        <Dialog open={open} fullWidth fullScreen={isFullScreen}>
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

export default InteriorDesignerInfoMobile;
