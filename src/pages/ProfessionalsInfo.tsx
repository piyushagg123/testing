import { useContext, useState } from "react";
import img from "../assets/background.jpg";
import projectImage from "../assets/noProjectAdded.jpg";
import reviewImage from "../assets/noReviewsAdded.png";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Chip, Tab, Tabs, Box } from "@mui/material";
import Carousel from "../components/Carousel";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import config from "../config";
import { AuthContext } from "../context/Login";

interface VendorData {
  logo?: string;
  category: string;
  sub_category_1: string;
  sub_category_2: string;
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

const fetchVendorDetails = async (id: string) => {
  const { data } = await axios.get(
    `${config.apiBaseUrl}/vendor/details?vendor_id=${id}`
  );

  return data.data as VendorData;
};

const fetchVendorProjects = async (id: string) => {
  const { data } = await axios.get(
    `${config.apiBaseUrl}/vendor/project/details?vendor_id=${id}`
  );
  return data.data as ProjectData[];
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProfessionalsInfo = () => {
  const authContext = useContext(AuthContext);

  if (authContext === undefined) {
    return;
  }
  const { login } = authContext;
  const { id } = useParams();
  const [selectedProject, setSelectedProject] = useState<ProjectData>();
  const [value, setValue] = useState(0);
  const { data: vendorData, isLoading: isVendorLoading } = useQuery(
    ["vendorDetails", id],
    () => fetchVendorDetails(id!)
  );

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery(
    ["vendorProjects", id],
    () => fetchVendorProjects(id!)
  );

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

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 1) handleBackClick();
  };

  if (isVendorLoading || isProjectsLoading) return <div>Loading...</div>;

  return (
    <div className="mt-[70px] text-text flex  justify-center gap-3 h-fit">
      <div className="text-[10px] md:text-[16px] flex flex-col gap-7 md:gap-0 pl-4">
        <br />
        <div className="w-[310px] md:w-max">
          <br />
          <div className="flex items-end gap-3">
            <div>
              {vendorData?.logo ? (
                <img
                  src={`${config.apiImageUrl}/${vendorData.logo}`}
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
                {formatCategory(
                  vendorData?.business_name ?? "Unknown Business"
                )}
              </p>
              <p className="mb-2 mt-2 flex gap-2 items-center">
                <span className="font-bold text-sm text-darkgrey">
                  SPECIALIZED THEMES :
                </span>{" "}
                {formatCategory(vendorData?.sub_category_1 ?? "N/A")
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
                {formatCategory(vendorData?.sub_category_2 ?? "N/A")
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
          {login ? (
            <>
              <div className="flex gap-3">
                <div>
                  <button
                    className="flex items-center gap-2 p-2 border-text border-[2px] text-text bg-prim hover:bg-sec hover:border-text rounded-md"
                    style={{ border: "solid 0.5px" }}
                  >
                    <StarBorderIcon /> <p>Write a Review</p>
                  </button>
                </div>
              </div>
              <br />
            </>
          ) : (
            <></>
          )}
          <div className="flex gap-3 text-[18px]  ">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              TabIndicatorProps={{
                sx: {
                  backgroundColor: "black",
                },
              }}
              sx={{
                "& .MuiTab-root": {
                  color: "gray",
                },
                "& .Mui-selected": {
                  color: "black",
                },
              }}
            >
              <Tab label="About Us" {...a11yProps(0)} />
              <Tab
                label="Projects"
                {...a11yProps(1)}
                onClick={handleBackClick}
              />
              <Tab label="Reviews" {...a11yProps(2)} />
            </Tabs>
          </div>
          <TabPanel value={value} index={0}>
            <div className="md:w-[500px] lg:w-[750px]">
              <p>{vendorData?.description}</p>
              <br />
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div className="md:w-[500px] lg:w-[750px] flex justify-center flex-col items-center">
              <br />
              <div className="flex flex-wrap">
                {!projectsData ? (
                  <div className="flex flex-col items-center justify-center">
                    <div>
                      <img src={projectImage} alt="" className="w-[300px]" />
                    </div>
                    <br />
                    <p className="">No projects added yet by the designer</p>
                    <br />
                  </div>
                ) : selectedProject ? (
                  <div className="flex flex-col">
                    <div className="flex justify-start gap-60 md:w-[500px] lg:w-[750px]">
                      <button
                        className="self-start mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                        onClick={handleBackClick}
                      >
                        Back
                      </button>
                    </div>
                    <br />
                    <div className="flex flex-col gap-3">
                      <Carousel
                        imageObj={selectedProject.images}
                        flag={false}
                        city=""
                        state=""
                        theme=""
                        title=""
                      />
                    </div>
                    <br />
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-between">
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
                          flag={true}
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
          <TabPanel value={value} index={2}>
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
        </div>
      </div>
      <br />
      <div className="w-[250px] text-lg ml-10">
        <br />
        <br />
        <div className=" ">
          <p className="font-bold text-base text-darkgrey">Contact Number</p>
          <p className="text-[16px]">{vendorData?.mobile ?? "N/A"}</p>
        </div>
        <br />
        <div className=" ">
          <p className="font-bold text-base text-darkgrey">Email</p>
          <p className="text-[16px]">{vendorData?.email ?? "N/A"}</p>
        </div>
        <br />
        <div className="flex flex-col justify-evenly gap-6">
          {selectedProject ? (
            <>
              <div>
                <p className="font-bold text-base text-darkgrey">Title</p>
                <p className="text-[16px] max-w-[300px]">
                  {selectedProject.title}
                </p>
              </div>
              <div>
                <p className="font-bold text-base text-darkgrey">Description</p>
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
                <p className="font-bold text-base text-darkgrey">Start Date</p>
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
              {vendorData?.social ? (
                <>
                  <div>
                    <p className="font-bold text-base text-darkgrey">Socials</p>
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
              ) : null}
            </>
          )}
        </div>
      </div>
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

export default ProfessionalsInfo;
