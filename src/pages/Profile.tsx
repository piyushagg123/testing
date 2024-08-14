import { useContext, useState } from "react";
import img from "../assets/background.jpg";
import projectImage from "../assets/noProjectAdded.jpg";
import reviewImage from "../assets/noReviewsAdded.png";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Tab,
} from "@mui/material";
import AddAProject from "../components/AddAProject";
import ProjectImages from "../components/ProjectImages";
import Carousel from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { AuthContext } from "../context/Login";
import constants from "../constants";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface ProjectItem {
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
const fetchData = async () => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/vendor/auth/details`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  return response.data.data;
};

const fetchProjects = async () => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/vendor/auth/project/details`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  return response.data.data;
};

const Profile = () => {
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    return;
  }
  const { setLogin } = authContext;
  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem>();
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState<number>(0);

  const { data, error, isLoading } = useQuery("vendorDetails", fetchData, {
    onError: () => {
      setLogin(false);
      navigate("/error");
    },
  });
  const [value, setValue] = useState("1");
  const { data: projectsData } = useQuery("vendorProjects", fetchProjects);

  const handleClose = () => {
    setOpen(false);
    setIsSubmitted(false);
    setSelectedSubCategories([]);
  };

  const handleCarouselClick = (project: ProjectItem) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    setSelectedProject(undefined);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === "2") handleBackClick();
  };

  const formatCategory = (str: string) => {
    let formattedStr = str.replace(/_/g, " ");
    formattedStr = formattedStr
      .toLowerCase()
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return formattedStr;
  };
  if (error) return <p>Error fetching data</p>;

  return (
    <>
      {isLoading ? <p>Loading</p> : ""}
      <div className="mt-[70px] text-text flex  justify-center gap-3 min-h-screen ">
        <div className="text-[10px] md:text-[16px]  flex flex-col gap-7 md:gap-0 pl-4">
          <br />
          <div className="w-[310px] md:w-max">
            <br />
            <div className="flex items-end gap-3">
              <div>
                {data?.logo ? (
                  <img
                    src={`${constants.apiImageUrl}/${data.logo}`}
                    alt=""
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
                <p>{}</p>
                <p className="font-bold text-base text-darkgrey">
                  {formatCategory(data?.business_name ?? "Unknown Business")}
                </p>
                <p className="mb-2 mt-2 flex gap-2 items-center">
                  <span className="font-bold text-sm text-darkgrey">
                    SPECIALIZED THEMES :
                  </span>{" "}
                  {formatCategory(data?.sub_category_1 ?? "N/A")
                    .split(",")
                    .map((item, ind) => (
                      <>
                        <Chip
                          label={item}
                          variant="outlined"
                          key={ind}
                          sx={{ height: "25px" }}
                        />
                      </>
                    ))}
                </p>

                <p className="flex gap-2 items-center">
                  <span className="font-bold text-sm text-darkgrey">
                    SPECIALIZED SPACES :
                  </span>{" "}
                  {formatCategory(data?.sub_category_2 ?? "N/A")
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
              </div>
            </div>
            <br />
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
                <div className="md:w-[500px] lg:w-[750px]">
                  <p>{data?.description}</p>
                  <br />
                </div>
              </TabPanel>
              <TabPanel value={"2"} sx={{ padding: 0, marginTop: "10px" }}>
                <div className="md:w-[500px] lg:w-[750px] flex justify-center flex-col items-center">
                  <br />
                  <div className="flex flex-wrap">
                    {!projectsData ? (
                      <div className="flex flex-col items-center justify-center">
                        <div>
                          <img
                            src={projectImage}
                            alt=""
                            className="w-[300px]"
                          />
                        </div>
                        <br />
                        <p className="">
                          No projects added yet by the designer
                        </p>
                        <br />
                      </div>
                    ) : selectedProject ? (
                      <div className="flex flex-col">
                        <div className="flex justify-start gap-60 md:w-[500px] lg:w-[750px]">
                          <button
                            className="self-start mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                            onClick={handleBackClick}
                          >
                            <ArrowBackIcon />
                          </button>
                        </div>
                        <br />
                        <div className="flex flex-col gap-3">
                          <Carousel
                            imageObj={selectedProject.images}
                            showProjectDetails={false}
                            city=""
                            state=""
                            theme=""
                            title=""
                          />
                        </div>
                        <br />
                      </div>
                    ) : (
                      <div className="flex flex-wrap md:w-[500px] lg:w-[750px] justify-between">
                        {projectsData.map((item: any, ind: number) => (
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
                  <br />
                  <br />
                </div>
              </TabPanel>
              <TabPanel value={"3"} sx={{ padding: 0, marginTop: "10px" }}>
                <div className="md:w-[500px] lg:w-[750px] flex justify-center flex-col items-center">
                  <br />
                  <div className="flex flex-wrap">
                    <div className="flex flex-col items-center justify-center">
                      <div>
                        <img src={reviewImage} alt="" className="w-[300px]" />
                      </div>
                      <br />
                      <p className="">No reviews added yet by the users</p>
                      <br />
                    </div>
                  </div>
                  <br />
                  <br />
                </div>
              </TabPanel>
            </TabContext>
          </div>
        </div>
        <br />
        <div className="w-[250px] text-lg ml-10">
          <br />
          <br />
          <div className=" ">
            <p className="font-bold text-base text-darkgrey">Contact Number</p>
            <p className="text-[16px]">{data?.mobile ?? "N/A"}</p>
          </div>
          <br />
          <div className=" ">
            <p className="font-bold text-base text-darkgrey">Email</p>
            <p className="text-[16px]">{data?.email ?? "N/A"}</p>
          </div>
          <br />
          <div className="flex flex-col justify-evenly gap-6">
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
                    {data?.average_project_value ?? "N/A"}
                  </p>
                </div>
                <div className=" ">
                  <p className="font-bold text-base text-darkgrey">
                    Number of employees
                  </p>
                  <p className="text-[16px]">
                    {data?.number_of_employees ?? "N/A"}
                  </p>
                </div>
                <div className=" ">
                  <p className="font-bold text-base text-darkgrey">
                    Projects Completed
                  </p>
                  <p className="text-[16px]">
                    {data?.projects_completed ?? "N/A"}
                  </p>
                </div>

                <div className=" ">
                  <p className="font-bold text-base text-darkgrey">Location</p>
                  <p className="text-[16px]">{data?.city ?? "N/A"}</p>
                </div>
                {data?.social ? (
                  <>
                    <div>
                      <p className="font-bold text-base text-darkgrey">
                        Socials
                      </p>
                      {data.social.facebook && (
                        <a
                          href={data.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FacebookIcon />
                        </a>
                      )}
                      {data.social.instagram && (
                        <a
                          href={data.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <InstagramIcon />
                        </a>
                      )}
                      {data.social.website && (
                        <a
                          href={data.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <OpenInNewIcon />
                        </a>
                      )}
                    </div>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>

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

export default Profile;
