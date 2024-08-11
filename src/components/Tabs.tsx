import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import Carousel from "../components/ProjectCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import projectImage from "../assets/noProjectAdded.jpg";
import reviewImage from "../assets/noReviewsAdded.png";
import { useState } from "react";

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

const Tabs = ({
  vendorData,
  projectsData,
  selectedProject,
  setSelectedProject,
}) => {
  const [value, setValue] = useState("1");

  const handleCarouselClick = (project: ProjectData) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    setSelectedProject(undefined);
  };
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
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
          <p>{vendorData?.description}</p>
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
  );
};

export default Tabs;
