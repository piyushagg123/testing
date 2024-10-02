import { FormEvent, useContext, useEffect, useState } from "react";
import projectImage from "../assets/noProjectAdded.jpg";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Tab,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Divider,
  Snackbar,
} from "@mui/material";
import Carousel from "../components/ProjectCard";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import constants from "../constants";
import { AuthContext } from "../context/Login";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Reviews from "../components/Reviews";
import ReviewDialog from "../components/ReviewDialog";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddAProject from "../components/AddAProject";
import ProjectImages from "../components/ProjectImages";
import CloseIcon from "@mui/icons-material/Close";
import ProfessionalHeader from "../components/ProfessionalHeader";
import Section from "../components/Section";

interface VendorData {
  logo?: string;
  category: string;
  sub_category_1: string;
  sub_category_2: string;
  sub_category_3: string;
  description: string;
  business_name: string;
  average_project_value: string;
  number_of_employees: number;
  projects_completed: number;
  mobile: string;
  email: string;
  city: string;
  social?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

interface ProjectData {
  images: Record<string, string[]>;
  title: string;
  description: string;
  city: string;
  state: string;
  sub_category_1: string;
  sub_category_2: string;
  start_date: string;
  end_date: string;
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

const fetchVendorDetails = async (id: string, renderProfileView: boolean) => {
  let data;
  if (renderProfileView) {
    const response = await axios.get(
      `${constants.apiBaseUrl}/vendor/auth/details`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    data = response.data;
  } else {
    const response = await axios.get(
      `${constants.apiBaseUrl}/vendor/details?vendor_id=${id}`
    );
    data = response.data;
  }

  return data.data as VendorData;
};

const fetchVendorProjects = async (id: string, renderProfileView: boolean) => {
  let data;
  if (renderProfileView) {
    const response = await axios.get(
      `${constants.apiBaseUrl}/vendor/auth/project/details`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    data = response.data;
  } else {
    const response = await axios.get(
      `${constants.apiBaseUrl}/vendor/project/details?vendor_id=${id}`
    );
    data = response.data;
  }
  return data.data as ProjectData[];
};
const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  renderProfileView,
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
    () => fetchVendorDetails(professionalId!, renderProfileView)
  );

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery(
    ["vendorProjects", professionalId],
    () => fetchVendorProjects(professionalId!, renderProfileView)
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

  const handleCarouselClick = (project: ProjectData) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    setSelectedProject(undefined);
  };

  const [activeSection, setActiveSection] = useState("about");

  const handleScrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
    }
    setActiveSection(section);
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
    window.location.reload();
  };
  const handleScroll = () => {
    const aboutSection = document.getElementById("about");
    const projectsSection = document.getElementById("projects");
    const reviewsSection = document.getElementById("reviews");

    const sections = [
      { id: "about", ref: aboutSection },
      { id: "projects", ref: projectsSection },
      { id: "reviews", ref: reviewsSection },
    ];

    sections.forEach((section) => {
      const rect = section.ref?.getBoundingClientRect();
      if (
        rect &&
        rect.top <= window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2
      ) {
        setActiveSection(section.id);
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const isMobile = window.innerWidth < 1024;
  const maxVisibleLength = 100;

  const contentPreview =
    isMobile && !expanded
      ? vendorData?.description.slice(0, maxVisibleLength) + "..."
      : vendorData?.description;

  if (isVendorLoading || isProjectsLoading)
    return <div className="min-h-screen">Loading...</div>;
  return (
    <>
      <div className="mt-[50px] text-text flex flex-col lg:flex-row  justify-center  min-h-screen">
        <div className="text-[10px] md:text-[16px] flex flex-col gap-7 md:gap-0">
          <div className=" md:w-max m-auto lg:m-0 md:mt-[2em]">
            <ProfessionalHeader vendorData={vendorData} />

            <div className="lg:hidden flex justify-center">
              <Section
                selectedProject={selectedProject}
                vendorData={vendorData}
              />
            </div>

            {login && userDetails?.vendor_id !== Number(professionalId) && (
              <div className=" gap-3 md:flex mb-[2em]">
                <div className="mt-3 mt:mt-0">
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
                    {renderProfileView ||
                      (Number(professionalId) == userDetails.vendor_id && (
                        <div
                          className={`${
                            selectedProject
                              ? "hidden"
                              : "flex w-full justify-end"
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
                      ))}
                    <div className="max-w-[95vw] overflow-x-auto whitespace-nowrap lg:w-[750px] flex justify-center  gap-1 items-center  md:m-0 ">
                      <div className="flex flex-wrap pt-[1em] mb-[3em]">
                        {!projectsData ? (
                          <div className="flex flex-col items-center justify-center ">
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
                        />
                      }
                    </div>
                  </TabPanel>
                </TabContext>
              </>
            ) : (
              <>
                <div className="button-container w-screen">
                  <button
                    className={`scroll-btn ${
                      activeSection === "projects" ? " text-[#8c52ff] abc" : ""
                    }`}
                    onClick={() => handleScrollToSection("projects")}
                  >
                    Projects
                  </button>
                  <button
                    className={`scroll-btn ${
                      activeSection === "reviews" ? " text-[#8c52ff] abc" : ""
                    }`}
                    onClick={() => handleScrollToSection("reviews")}
                  >
                    Reviews
                  </button>
                </div>

                <div id="projects" className="section ">
                  {renderProfileView && (
                    <div
                      className={`${
                        selectedProject
                          ? "hidden"
                          : "flex mt-3 mx-3 justify-end"
                      }`}
                    >
                      <Button
                        variant="outlined"
                        style={{ backgroundColor: "#8c52ff", color: "white" }}
                        onClick={() => setOpen(true)}
                      >
                        <AddCircleIcon /> Add a new project
                      </Button>
                    </div>
                  )}
                  <div className="w-[90vw] m-auto  overflow-x-auto whitespace-nowrap lg:w-[750px] flex  gap-2  pt-[2rem] ">
                    <div className="flex  mb-[3em] ">
                      {!projectsData ? (
                        <div className="flex flex-col items-center justify-center w-[90vw]">
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
                        <div className="flex overflow-x-auto whitespace-nowrap lg:w-[750px] ">
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
                  <Divider />
                </div>
                <div id="reviews" className="section pt-20 w-[90vw] m-auto">
                  <div className=" lg:w-[750px] border-[#d3d8e0] border-[1px] rounded-md   flex justify-center flex-col items-center p-2">
                    {
                      <Reviews
                        id={
                          professionalId ? Number(professionalId) : Number(-1)
                        }
                      />
                    }
                  </div>
                  <Divider />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="hidden lg:block">
          <Section selectedProject={selectedProject} vendorData={vendorData} />
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

export default ProfessionalInfo;
