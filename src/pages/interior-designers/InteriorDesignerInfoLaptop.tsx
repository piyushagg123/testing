import { FormEvent, useContext, useEffect, useState } from "react";
import projectImage from "../../assets/noProjectAdded.jpg";
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Snackbar,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import constants from "../../constants";
import { AuthContext } from "../../context/Login";
import {
  Reviews,
  ReviewDialog,
  AddAProject,
  ProjectImages,
  Carousel,
} from "../../components";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import {
  OpenInNew,
  StarBorder,
  Facebook,
  Instagram,
} from "@mui/icons-material";
import img from "../../assets/noImageinProject.jpg";
import { ProfessionalInfoProps, ProjectData } from "./Types";
import {
  fetchVendorDetails,
  fetchVendorProjects,
  submitReview,
} from "./Controller";
import {
  removeUnderscoresAndFirstLetterCapital,
  truncateText,
} from "../../helpers/StringHelpers";

const InteriorDesignerInfoLaptop: React.FC<ProfessionalInfoProps> = ({
  renderProfileView,
  renderProfessionalInfoView,
}) => {
  const authContext = useContext(AuthContext);

  if (authContext === undefined) {
    return;
  }
  const { login, userDetails } = authContext;
  const { professionalId } = useParams();

  const [selectedProject, setSelectedProject] = useState<
    ProjectData | undefined
  >(undefined);

  const { data: projectsData } = useQuery(
    ["vendorProjects", professionalId],
    () => fetchVendorProjects(professionalId!, renderProfileView)
  );

  useEffect(() => {
    if (projectsData && projectsData.length > 0) {
      setSelectedProject(projectsData[0]);
    }
  }, [projectsData]);
  const { data: vendorData } = useQuery(["vendorDetails", professionalId], () =>
    fetchVendorDetails(professionalId!, renderProfileView)
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

  const handleCarouselClick = (project: ProjectData) => {
    setSelectedProject(project);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    await submitReview(
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
  const [expanded, setExpanded] = useState(false);
  const [expandedAbout, setExpandedAbout] = useState(false);
  const handleExpandAboutClick = () => {
    setExpandedAbout(!expandedAbout);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const maxVisibleLength = 300;

  const contentPreview = !expanded
    ? truncateText(vendorData?.description!, maxVisibleLength)
    : vendorData?.description;

  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const professionalCard = (
    <div className=" text-[12px] md:text-[16px]  lg:ml-6 lg:mt-10 flex-col flex  gap-4 items-center p-2 lg:border lg:rounded-md">
      <div className="flex flex-row  w-full">
        <div className="mt-[1em] w-1/2 ">
          <p className="font-bold  text-black">Typical Job Cost</p>
          <p className="">{vendorData?.average_project_value ?? "N/A"}</p>
        </div>
        <div className="mt-[1em] w-1/2 ">
          <p className="font-bold  text-black">Number of Employees</p>
          <p className="">{vendorData?.number_of_employees ?? "N/A"}</p>
        </div>
      </div>
      <div className="flex  w-full flex-row  mt-[1em]">
        <div className="w-1/2  mt-[1em]">
          <p className="font-bold  text-black">Projects Completed</p>
          <p className="">{vendorData?.projects_completed ?? "N/A"}</p>
        </div>
        <div className=" w-1/2  mt-[1em]">
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
        <div className="w-1/2 ">
          <p className="font-bold text-black mt-[1em]">Contact Number</p>
          <p className="">{vendorData?.mobile ?? "N/A"}</p>
        </div>
      </div>
      <div className="w-full mt-[1em]">
        <p className="font-bold  text-black">Email</p>
        <p className="">{vendorData?.email ?? "N/A"}</p>
      </div>
      <div className=" w-full ">
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
    <div className="flex flex-col md:flex-row md:items-center md:justify-center lg:justify-start   lg:items-start gap-3 md:mt-[2em] mb-[1em] w-[93vw] lg:w-[100%] md:w-auto mx-auto lg:mx-0">
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
            SPECIALIZED THEMES :
          </span>{" "}
          <div className="flex flex-wrap gap-1">
            {removeUnderscoresAndFirstLetterCapital(
              vendorData?.sub_category_1 ?? "N/A"
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
              vendorData?.sub_category_2 ?? "N/A"
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
          </span>{" "}
          {(vendorData?.sub_category_3 ?? "N/A")
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
  return (
    <>
      <div className="mt-16 px-16 flex">
        <div className="w-[60%]">
          {professionalHeader}

          {login && userDetails?.vendor_id !== Number(professionalId) && (
            <div className=" gap-3 md:flex mb-[2em]">
              <div className="mt-3 ml-2 lg:ml-0 mt:mt-0">
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

          <div id="projects" className=" mb-[10px] hidden lg:block w-[100%]">
            <p className="text-base font-bold  lg:w-auto m-auto">Projects</p>
            <div className="  m-auto  horizontal-scroll w-[100%] flex  gap-2  pt-[10px] ">
              <div className="flex   w-full">
                {!projectsData ? (
                  <div className="flex flex-col items-center justify-center w-full">
                    {(renderProfileView ||
                      Number(professionalId) == userDetails.vendor_id) && (
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
                      !renderProfileView && (
                        <>
                          <div>
                            <div className="mb-[1em]">
                              <img
                                src={projectImage}
                                alt=""
                                className="w-[300px]"
                              />
                            </div>
                            <p className="mb-[1em]">
                              No projects added yet by the designer
                            </p>
                          </div>
                        </>
                      )}
                  </div>
                ) : (
                  <div
                    className="flex overflow-x-auto whitespace-nowrap items-start "
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <div>
                      {(renderProfileView ||
                        Number(professionalId) == userDetails.vendor_id) && (
                        <div
                          className={`
                           mr-2
                         mb-3`}
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
                          isActive={item === selectedProject}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedProject && (
            <>
              <div className=" text-[12px] md:text-[16px]   lg:mt-10 flex-col flex  gap-4  p-2 lg:border lg:rounded-md w-full mb-3">
                <div>
                  <p className="font-bold  text-black">Project name</p>
                  <p>{selectedProject.title}</p>
                </div>

                <div className="flex">
                  <div className="w-1/2">
                    <p className="font-bold  text-black  mt-[1em] ">City</p>
                    <p>{selectedProject.city}</p>
                  </div>
                  <div className="w-1/2">
                    <p className="font-bold  text-black mt-[1em]">State</p>
                    <p>{selectedProject.state}</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/2">
                    <p className="font-bold  text-black mt-[1em]">Spaces</p>
                    <p className="">
                      {removeUnderscoresAndFirstLetterCapital(
                        Object.keys(selectedProject.images).join(",")
                      )}
                    </p>
                  </div>
                  <div className="w-1/2">
                    <p className="font-bold  text-black  mt-[1em]">Theme</p>
                    <p className="">
                      {removeUnderscoresAndFirstLetterCapital(
                        selectedProject.sub_category_1
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-bold  text-black  mt-[1em]">Description</p>

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
                </div>
              </div>

              <Carousel
                imageObj={selectedProject.images}
                title={selectedProject.title}
                city={selectedProject.city}
                state={selectedProject.state}
                theme={selectedProject.sub_category_1}
                showProjectDetails={false}
              />
              <br />
              <br />
              <br />
              <br />
            </>
          )}
        </div>

        <div className=" h-fit w-[40%] flex flex-col">
          {professionalCard}
          <br />
          <div id="reviews" className=" mb-[10px]   ml-6  ">
            <div className=" flex justify-center border rounded-md w-full flex-col items-center px-2   py-[1em]">
              {
                <Reviews
                  id={professionalId ? Number(professionalId) : Number(-1)}
                  vendorType="interiorDesigner"
                />
              }
            </div>
          </div>
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

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          message="Review submitted successfully!"
          key="bottom-center"
          autoHideDuration={3000}
        />
      </div>
    </>
  );
};

export default InteriorDesignerInfoLaptop;
