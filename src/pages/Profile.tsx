import { useContext, useState } from "react";
import img from "../assets/background.jpg";
import projectImage from "../assets/noProjectAdded.jpg";
import reviewImage from "../assets/noReviewsAdded.png";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import AddAProject from "../components/AddAProject";
import ProjectImages from "../components/ProjectImages";
import Carousel from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { AuthContext } from "../context/Login";
import config from "../config";

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
  const response = await axios.get(`${config.apiBaseUrl}/vendor/auth/details`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  return response.data.data;
};

const fetchProjects = async () => {
  const response = await axios.get(
    `${config.apiBaseUrl}/vendor/auth/project/details`,
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
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState<number>(0);

  const { data, error, isLoading } = useQuery("vendorDetails", fetchData, {
    onError: () => {
      setLogin(false);
      navigate("/error");
    },
  });
  const [value, setValue] = useState(0);
  const { data: projectsData } = useQuery("vendorProjects", fetchProjects);

  const handleClose = () => {
    setOpen(false);
    setIsSubmitted(false);
    setSelectedSubCategories([]);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <div className="mt-[70px] text-text h-fit flex  justify-center gap-3">
      <div className="text-[10px] md:text-[16px]  flex flex-col gap-7 md:gap-0 pl-4">
        <br />
        <div className="w-[310px] md:w-max">
          <br />
          <div className="flex items-end gap-3">
            <div>
              {data?.logo ? (
                <img
                  src={`${config.apiImageUrl}/${data.logo}`}
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
                        label={item}
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
          <div className="flex gap-3 text-[18px] ">
            <Tabs
              value={value}
              onChange={handleChange}
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
                label="About Us"
                sx={{ fontWeight: "bold", textTransform: "none" }}
              />
              <Tab
                label="Projects"
                sx={{ fontWeight: "bold", textTransform: "none" }}
              />
              <Tab
                label="Reviews"
                sx={{ fontWeight: "bold", textTransform: "none" }}
              />
            </Tabs>
          </div>
          <TabPanel value={value} index={0}>
            <div className="md:w-[500px] lg:w-[750px]">
              <p>{data?.description}</p>
              <br />
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div
              className={`md:w-[500px] lg:w-[750px] flex justify-center flex-col items-center`}
            >
              <br />
              <div className="flex w-full justify-end">
                <button
                  className="flex items-center gap-2 p-2 border-text border-[2px] text-text bg-prim hover:bg-sec hover:border-text rounded-[5px]"
                  onClick={() => setOpen(true)}
                >
                  <AddCircleIcon /> Add a new project
                </button>
              </div>
              <br />
              <div className="flex w-[100%] flex-wrap gap-10 justify-between">
                {!projectsData ? (
                  <div className="flex flex-col">
                    <div className="">
                      <img src={projectImage} alt="" className="w-[300px]" />
                    </div>
                    <br />
                    <p className="">No projects added yet by the designer</p>
                    <br />
                  </div>
                ) : (
                  projectsData.map((item: ProjectItem, ind: number) => (
                    <Carousel
                      imageObj={item.images}
                      title={item.title}
                      city={item.city}
                      state={item.state}
                      theme={item.sub_category_1}
                      key={ind}
                      showProjectDetails={true}
                    />
                  ))
                )}
              </div>
              <br />
              <br />
              <br />
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div
              className={`md:w-[500px] lg:w-[750px] flex justify-center flex-col items-center`}
            >
              <br />
              <div className="">
                <img src={reviewImage} alt="" className="w-[300px]" />
              </div>
              <br />
              <p>No reviews added yet!!</p>
              <br />
              <br />
              <br />
            </div>
          </TabPanel>
        </div>
      </div>
      <br />
      <div className="w-[200px] text-lg ml-10">
        <br />
        <br />
        <div className="flex flex-col justify-evenly gap-6">
          <div className=" ">
            <p className="font-bold text-base text-darkgrey">Business Name</p>
            <p className="text-[16px]">{data.business_name}</p>
          </div>
          <div className=" ">
            <p className="font-bold text-base text-darkgrey">
              Typical Job Cost
            </p>
            <p className="text-[16px]">{data.average_project_value}</p>
          </div>
          <div className=" ">
            <p className="font-bold text-base text-darkgrey">
              Number of employees
            </p>
            <p className="text-[16px]">{data.number_of_employees}</p>
          </div>
          <div className=" ">
            <p className="font-bold text-base text-darkgrey">
              Projects Completed
            </p>
            <p className="text-[16px]">{data.projects_completed}</p>
          </div>

          <div className=" ">
            <p className="font-bold text-base text-darkgrey">Contact Number</p>
            <p className="text-[16px]">{data.mobile}</p>
          </div>
          {data.social ? (
            <>
              {data.social.instagram || data.social.facebook ? (
                <>
                  <div className=" ">
                    <p className="font-bold text-base text-darkgrey">Socials</p>
                    <div className="flex gap-3 text-[16px]">
                      <a href={data?.social?.facebook}>
                        <FacebookIcon />
                      </a>
                      <a href={data?.social?.instagram}>
                        <InstagramIcon />
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}

          <div className=" ">
            <p className="font-bold text-base text-darkgrey">Address</p>
            <p className="text-[16px]">
              {data.address} <br />
              {data.city} <br />
              {data.state}
            </p>
          </div>
          {data.social ? (
            <>
              {data.social.website ? (
                <>
                  <div className=" ">
                    <p className="font-bold text-base text-darkgrey">Website</p>
                    <a
                      href={data?.social?.website}
                      className="flex items-center gap-1 text-[16px]"
                    >
                      homezdesigners.com <OpenInNewIcon />
                    </a>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}

          <div className=" ">
            <p className="font-bold text-base text-darkgrey">Email</p>
            <a
              href={`mailto:${data.email}`}
              className="flex items-center gap-1 text-[16px]"
            >
              {data.email} <OpenInNewIcon />
            </a>
          </div>
          <br />
          <br />
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
              <AddAProject setProjectId={setProjectId} projectId={projectId} />{" "}
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
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ paddingY: 1 }}>{children}</Box>}
    </div>
  );
}

export default Profile;
