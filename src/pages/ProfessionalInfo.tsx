import { FormEvent, useContext, useState } from "react";
import img from "../assets/background.jpg";
import projectImage from "../assets/noProjectAdded.jpg";
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

interface ProfileorProfessional {
  flag: boolean;
}

const fetchVendorDetails = async (id: string, flag: boolean) => {
  let data;
  if (flag) {
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

const fetchVendorProjects = async (id: string, flag: boolean) => {
  let data;
  if (flag) {
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
const ProfessionalInfo: React.FC<ProfileorProfessional> = ({ flag }) => {
  const authContext = useContext(AuthContext);

  if (authContext === undefined) {
    return;
  }
  const { login } = authContext;
  let professionId = "-1";
  if (!flag) {
    const { id } = useParams();
    professionId = id!;
  }
  const [selectedProject, setSelectedProject] = useState<ProjectData>();
  const [value, setValue] = useState("1");
  const { data: vendorData, isLoading: isVendorLoading } = useQuery(
    ["vendorDetails", professionId],
    () => fetchVendorDetails(professionId!, flag)
  );

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery(
    ["vendorProjects", professionId],
    () => fetchVendorProjects(professionId!, flag)
  );

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [projectId, setProjectId] = useState<number>(0);
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

  const handleCarouselClick = (project: ProjectData) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    setSelectedProject(undefined);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    const formObject: ReviewFormObject = { vendor_id: Number(professionId) };
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
    } catch (error: any) {
      setReviewError(error.response.data.debug_info);
    }
    setLoading(false);
  };

  if (isVendorLoading || isProjectsLoading)
    return <div className="min-h-screen">Loading...</div>;
  return (
    <>
      {window.scrollTo(0, 0)}
      <div className="mt-[70px] text-text flex flex-col lg:flex-row  justify-center  min-h-screen">
        <div className="text-[10px] md:text-[16px] flex flex-col gap-7 md:gap-0 pl-2 md:pl-4">
          <div className=" md:w-max m-auto lg:m-0 my-[2em]">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-3 mb-[1em]">
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
                <p className="font-bold text-base text-darkgrey m-auto">
                  {formatCategory(
                    vendorData?.business_name ?? "Unknown Business"
                  )}
                </p>
                <p className="mb-2 mt-2 flex flex-col md:flex-row gap-2 items-start md:items-center">
                  <span className="font-bold text-sm text-darkgrey">
                    SPECIALIZED THEMES :
                  </span>{" "}
                  <div className="flex gap-1">
                    {formatCategory(vendorData?.sub_category_1 ?? "N/A")
                      .split(",")
                      .map((item, ind) => (
                        <>
                          <Chip
                            label={item.charAt(0).toUpperCase() + item.slice(1)}
                            variant="outlined"
                            key={ind}
                            sx={{ height: "25px" }}
                          />
                        </>
                      ))}
                  </div>
                </p>

                <p className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
                  <span className="font-bold text-sm text-darkgrey">
                    SPECIALIZED SPACES :
                  </span>
                  {formatCategory(vendorData?.sub_category_2 ?? "N/A")
                    .split(",")
                    .map((item, ind) => (
                      <>
                        <Chip
                          label={item.charAt(0).toUpperCase() + item.slice(1)}
                          variant="outlined"
                          key={ind}
                          sx={{ height: "25px" }}
                        />
                      </>
                    ))}
                </p>
                <p className="flex gap-2 items-center">
                  <span className="font-bold text-sm text-darkgrey">
                    EXECUTION TYPE :
                  </span>{" "}
                  {(vendorData?.sub_category_3 ?? "N/A")
                    .split(",")
                    .map((item, ind) => (
                      <>
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
                          sx={{ height: "25px" }}
                        />
                      </>
                    ))}
                </p>
              </div>
            </div>

            {login ? (
              <>
                <div className=" gap-3 hidden md:flex mb-[2em]">
                  <div>
                    {!flag && (
                      <button
                        className="flex items-center gap-2 p-2 border-text border-[2px] text-text bg-prim hover:bg-sec hover:border-text rounded-md"
                        style={{ border: "solid 0.5px" }}
                        onClick={handleReviewDialogOpen}
                      >
                        <StarBorderIcon /> <p>Write a Review</p>
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
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
                <div className="w-[90vw] md:w-[500px] lg:w-[750px]">
                  <p className="text-base mb-[1em]">
                    {vendorData?.description}
                  </p>
                </div>
              </TabPanel>
              <TabPanel value={"2"} sx={{ padding: 0, marginTop: "10px" }}>
                {flag && (
                  <div
                    className={`${
                      selectedProject ? "hidden" : "flex w-full justify-end"
                    }`}
                  >
                    <button
                      className="hidden lg:flex items-center gap-2 p-2 border-text border-[2px] text-text bg-prim hover:bg-sec hover:border-text rounded-[5px]"
                      onClick={() => setOpen(true)}
                    >
                      <AddCircleIcon /> Add a new project
                    </button>
                  </div>
                )}
                <div className="w-[90vw] md:w-[500px] lg:w-[750px] flex justify-center flex-col items-center ">
                  <div className="flex flex-wrap pt-[1em] mb-[3em]">
                    {!projectsData ? (
                      <div className="flex flex-col items-center justify-center">
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
                      <div className="flex flex-col">
                        <div className="flex mb-[1em] justify-start gap-60 md:w-[500px] lg:w-[750px]">
                          <button
                            className="self-start mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                            onClick={handleBackClick}
                          >
                            <ArrowBackIcon />
                          </button>
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
                      <div className="flex flex-wrap md:w-[500px] lg:w-[750px] justify-between">
                        {projectsData.map((item, ind) => (
                          <div
                            key={ind}
                            onClick={() => handleCarouselClick(item)}
                            className="mb-4"
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
                <div className="w-[90vw] md:w-[500px] lg:w-[750px] flex justify-center flex-col items-center">
                  {<Reviews id={Number(professionId)} />}
                </div>
              </TabPanel>
            </TabContext>
          </div>
        </div>
        <div className="w-[250px] text-lg ml-2 md:ml-10 mt-10">
          <div className=" ">
            <p className="font-bold text-base text-darkgrey">Contact Number</p>
            <p className="text-[16px]">{vendorData?.mobile ?? "N/A"}</p>
          </div>
          <div className="mt-[1em] ">
            <p className="font-bold text-base text-darkgrey">Email</p>
            <p className="text-[16px]">{vendorData?.email ?? "N/A"}</p>
          </div>
          <div className="flex flex-col justify-evenly mt-[1em] gap-6">
            {selectedProject ? (
              <>
                <div>
                  <p className="font-bold text-base text-purple">
                    Project details
                  </p>
                  <p className="font-bold text-base text-darkgrey">Title</p>
                  <p className="text-[16px] max-w-[300px]">
                    {selectedProject.title}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-base text-darkgrey">
                    Description
                  </p>
                  <p className="text-[16px] max-w-[300px]">
                    {selectedProject.description}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-base text-darkgrey">City</p>
                  <p className="text-[16px] max-w-[300px]">
                    {selectedProject.city}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-base text-darkgrey">State</p>
                  <p className="text-[16px] max-w-[300px]">
                    {selectedProject.state}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-base text-darkgrey">Spaces</p>
                  <p className="text-[16px]">
                    {formatCategory(selectedProject.sub_category_2)
                      .split(",")
                      .map((item, ind) => (
                        <>
                          <Chip
                            label={item}
                            variant="outlined"
                            key={ind}
                            sx={{ height: "25px" }}
                            style={{
                              color: "linear-gradient(#ff5757,#8c52ff)",
                            }}
                          />
                        </>
                      ))}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-base text-darkgrey">Theme</p>
                  <p className="text-[16px]">
                    {formatCategory(selectedProject.sub_category_1)
                      .split(",")
                      .map((item, ind) => (
                        <>
                          <Chip
                            label={item}
                            variant="outlined"
                            key={ind}
                            sx={{ height: "25px" }}
                            style={{
                              color: "linear-gradient(#ff5757,#8c52ff)",
                            }}
                          />
                        </>
                      ))}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-base text-darkgrey">
                    Start Date
                  </p>
                  <p className="text-[16px] max-w-[300px]">
                    {selectedProject.start_date}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-base text-darkgrey">End date</p>
                  <p className="text-[16px] max-w-[300px]">
                    {selectedProject.end_date}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="font-bold text-base text-darkgrey">
                    Typical Job Cost
                  </p>
                  <p className="text-[16px]">
                    {vendorData?.average_project_value ?? "N/A"}
                  </p>
                </div>
                <div className=" ">
                  <p className="font-bold text-base text-darkgrey">
                    Number of employees
                  </p>
                  <p className="text-[16px]">
                    {vendorData?.number_of_employees ?? "N/A"}
                  </p>
                </div>
                <div className=" ">
                  <p className="font-bold text-base text-darkgrey">
                    Projects Completed
                  </p>
                  <p className="text-[16px]">
                    {vendorData?.projects_completed ?? "N/A"}
                  </p>
                </div>

                <div className=" ">
                  <p className="font-bold text-base text-darkgrey">Location</p>
                  <p className="text-[16px]">{vendorData?.city ?? "N/A"}</p>
                </div>
                {(vendorData?.social?.facebook ||
                  vendorData?.social?.instagram ||
                  vendorData?.social?.website) && (
                  <>
                    <div>
                      <p className="font-bold text-base text-darkgrey">
                        Socials
                      </p>
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
                  </>
                )}
              </>
            )}
          </div>
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
                x
              </IconButton>
            </div>
            {!isSubmitted ? (
              <>
                <AddAProject
                  setProjectId={setProjectId}
                  projectId={projectId}
                />{" "}
              </>
            ) : (
              <>
                <ProjectImages
                  subCategories={selectedSubCategories}
                  projectId={projectId}
                />
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ProfessionalInfo;
