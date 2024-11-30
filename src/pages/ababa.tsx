import { useContext, useState } from "react";
import img from "../assets/background.jpg";
import projectImage from "../assets/noProjectAdded.jpg";
import reviewImage from "../assets/noReviewsAdded.png";
// import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import InstagramIcon from "@mui/icons-material/Instagram";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Tab,
  // TextField,
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
import MultipleSelect from "../components/MultipleSelect";
import BorderColorIcon from "@mui/icons-material/BorderColor";

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

interface VendorData {
  logo?: string;
  category?: string;
  sub_category_1?: string;
  sub_category_2?: string;
  sub_category_3?: string;
  description?: string;
  business_name?: string;
  average_project_value?: number;
  number_of_employees?: number;
  projects_completed?: number;
  mobile?: string;
  email?: string;
  city?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
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

  // console.log(response.data.data);

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

  const [editMode, setEditMode] = useState(false); // State for edit mode
  const [formData, setFormData] = useState<VendorData>({
    business_name: "",
    sub_category_1: "",
    sub_category_2: "",
    sub_category_3: "",
    description: "",
    mobile: "",
    email: "",
    category: "",
    average_project_value: 0,
    number_of_employees: 0,
    projects_completed: 0,
    city: "",
    social: {
      facebook: "",
      instagram: "",
      website: "",
    },
  });

  const { data, error, isLoading } = useQuery("vendorDetails", fetchData, {
    onSuccess: (data) => {
      setFormData({
        business_name: data.business_name,
        sub_category_1: data.sub_category_1 || "",
        sub_category_2: data.sub_category_2 || "",
        sub_category_3: data.sub_category_3 || "",
        description: data.description,
        mobile: data.mobile,
        email: data.email,
        category: data.category,
        average_project_value: data.average_project_value,
        number_of_employees: data.number_of_employees,
        projects_completed: data.projects_completed,
        city: data.city,
        social: {
          facebook: data.social?.facebook ?? "",
          instagram: data.social?.instagram ?? "",
          website: data.social?.website ?? "",
        },
      });
    },
    onError: () => {
      setLogin(false);
      navigate("/error");
    },
  });
  const [value, setValue] = useState("1");
  const { data: projectsData } = useQuery("vendorProjects", fetchProjects);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e: any) => {
    console.log(e.target);

    const { name, value } = e.target;

    // Check if the name belongs to the social object
    if (["facebook", "instagram", "website"].includes(name)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        social: {
          ...prevFormData.social,
          [name]: value, // Update the nested social field
        },
      }));
    } else {
      // For other top-level fields
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  const handleSave = async () => {
    console.log(formData);

    // try {
    //   const response = await axios.post(
    //     `${constants.apiBaseUrl}/vendor/update`,
    //     formData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    //       },
    //     }
    //   );
    //   console.log(response);

    //   console.log("success");
    //   // Optionally, handle the response or update state/UI
    //   setEditMode(false);
    // } catch (error) {
    //   console.error("Error updating profile:", error);
    // }
    // window.location.reload();
  };

  const handleCancel = () => {
    setFormData({
      business_name: data?.business_name || "",
      sub_category_1: data?.sub_category_1 || "",
      sub_category_2: data?.sub_category_2 || "",
      sub_category_3: data?.sub_category_3 || "",
      description: data?.description || "",
      mobile: data?.mobile || "",
      email: data?.email || "",
      category: data?.category || "",
      average_project_value: data?.average_project_value || "",
      number_of_employees: data?.number_of_employees || 0,
      projects_completed: data?.projects_completed || 0,
      city: data?.city || "",
      social: {
        facebook: data?.social?.facebook || "",
        instagram: data?.social?.instagram || "",
        website: data?.social?.website || "",
      },
    });
  };

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <>
      <div className="mt-[70px] text-text h-fit flex  justify-center gap-3">
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
              {/* <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditClick}
                >
                  {editMode ? "Cancel" : "Edit"}
                </Button>
              </div> */}
              <div>
                <p>{}</p>
                <p className="font-bold text-base text-darkgrey">
                  {editMode ? (
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    formatCategory(data?.business_name ?? "Unknown Business")
                  )}

                  <button onClick={handleEditClick} className="ml-4">
                    {editMode ? "CrossIcon" : <BorderColorIcon />}
                  </button>
                </p>
                <p className="mb-2 mt-2 flex gap-2 items-center">
                  <span className="font-bold text-sm text-darkgrey">
                    SPECIALIZED THEMES:
                  </span>
                  {editMode ? (
                    <MultipleSelect
                      selectedValue={
                        formData.sub_category_1
                          ? formData.sub_category_1.split(",")
                          : []
                      }
                      onChange={(selected) => {
                        console.log("Selected Themes:", selected);
                        setFormData((prevData) => ({
                          ...prevData,
                          sub_category_1: selected.join(","),
                        }));
                      }}
                      maxSelection={3}
                      apiEndpoint={`${constants.apiBaseUrl}/category/subcategory1/list?category=INTERIOR_DESIGNER`}
                    />
                  ) : (
                    formData.sub_category_1 &&
                    formData.sub_category_1
                      .split(",")
                      .map((item, ind) => (
                        <Chip
                          label={item}
                          variant="outlined"
                          key={ind}
                          sx={{ height: "25px" }}
                        />
                      ))
                  )}
                </p>

                <p className="flex gap-2 items-center">
                  <span className="font-bold text-sm text-darkgrey">
                    SPECIALIZED SPACES:
                  </span>
                  {editMode ? (
                    <MultipleSelect
                      selectedValue={
                        formData.sub_category_2
                          ? formData.sub_category_2.split(",")
                          : []
                      }
                      onChange={(selected) => {
                        console.log("Selected Spaces:", selected);
                        setFormData((prevData) => ({
                          ...prevData,
                          sub_category_2: selected.join(","),
                        }));
                      }}
                      maxSelection={3}
                      apiEndpoint={`${constants.apiBaseUrl}/category/subcategory2/list?category=INTERIOR_DESIGNER`}
                    />
                  ) : (
                    formData.sub_category_2 &&
                    formData.sub_category_2
                      .split(",")
                      .map((item, ind) => (
                        <Chip
                          label={item}
                          variant="outlined"
                          key={ind}
                          sx={{ height: "25px" }}
                        />
                      ))
                  )}
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
                  {editMode ? (
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{data?.description}</p>
                  )}
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
            <p>{data?.mobile ?? "N/A"}</p>
          </div>
          <br />
          <div className=" ">
            <p className="font-bold text-base text-darkgrey">Email</p>
            <p>{data?.email ?? "N/A"}</p>
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
                  {editMode ? (
                    <input
                      type="text"
                      name="average_project_value"
                      value={formData.average_project_value}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{data?.average_project_value ?? "N/A"}</p>
                  )}
                </div>
                <div className=" ">
                  <p className="font-bold text-base text-darkgrey">
                    Number of employees
                  </p>
                  {editMode ? (
                    <input
                      type="number"
                      name="number_of_employees"
                      value={formData.number_of_employees}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{data?.number_of_employees ?? 0}</p>
                  )}
                </div>
                <div className=" ">
                  <p className="font-bold text-base text-darkgrey">
                    Projects Completed
                  </p>
                  {editMode ? (
                    <input
                      type="number"
                      name="projects_completed"
                      value={formData.projects_completed}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{data?.projects_completed ?? 0}</p>
                  )}
                </div>

                <div className=" ">
                  <p className="font-bold text-base text-darkgrey">Location</p>
                  <p>{data?.city ?? "N/A"}</p>
                </div>
                <div>
                  <p>Social Links:</p>
                  <div>
                    <label>Facebook:</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="facebook"
                        value={formData?.social?.facebook}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{data?.social?.facebook ?? "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label>Instagram:</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="instagram"
                        value={formData?.social?.instagram}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{data?.social?.instagram ?? "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label>Website:</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="website"
                        value={formData?.social?.website}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{data?.social?.website ?? "N/A"}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {editMode && (
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
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
