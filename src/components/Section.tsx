import { Chip } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";

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

interface SectionProps {
  vendorData: VendorData | undefined;
  selectedProject: ProjectData | undefined;
}

const Section: React.FC<SectionProps> = ({ vendorData, selectedProject }) => {
  const isMobile = useMediaQuery("(max-width:768px)");

  const formatCategory = (str: string) => {
    let formattedStr = str.replace(/_/g, " ");
    return formattedStr
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const ismobile = window.innerWidth <= 500;
  const maxVisibleLength = 100;
  const contentPreview =
    isMobile && !expanded
      ? vendorData?.description.slice(0, maxVisibleLength) + "..."
      : vendorData?.description;
  const content = (
    <div className=" text-[12px] md:text-[16px]  md:ml-10 md:mt-10 flex-col flex md:block gap-4 items-center p-2">
      <>
        <>
          {selectedProject ? (
            <>
              <div className="w-1/2 md:w-fit">
                <p className="font-bold text-black">Contact Number</p>
                <p className="">{vendorData?.mobile ?? "N/A"}</p>
              </div>
              <div className="w-full mt-[1em]">
                <p className="font-bold  text-black">Email</p>
                <p className="">{vendorData?.email ?? "N/A"}</p>
              </div>
              <div>
                <p className="font-bold  text-purple  mt-[1em]">
                  Project Details
                </p>
                <p className="font-bold  text-black">Title</p>
                <p className=" max-w-[300px]">{selectedProject.title}</p>
              </div>
              <div>
                <p className="font-bold  text-black  mt-[1em]">Description</p>
                <p className=" max-w-[300px]">{selectedProject.description}</p>
              </div>
              <div>
                <p className="font-bold  text-black  mt-[1em]">City</p>
                <p className=" max-w-[300px]">{selectedProject.city}</p>
              </div>
              <div>
                <p className="font-bold  text-black mt-[1em]">State</p>
                <p className=" max-w-[300px]">{selectedProject.state}</p>
              </div>
              <div>
                <p className="font-bold  text-black mt-[1em]">Spaces</p>
                <p className="">
                  {formatCategory(selectedProject.sub_category_2)
                    .split(",")
                    .map((item: any, ind: number) => (
                      <Chip
                        label={item}
                        variant="outlined"
                        key={ind}
                        sx={{ height: "25px" }}
                        style={{
                          color: "linear-gradient(#ff5757,#8c52ff)",
                        }}
                      />
                    ))}
                </p>
              </div>
              <div>
                <p className="font-bold  text-black  mt-[1em]">Theme</p>
                <p className="">
                  {formatCategory(selectedProject.sub_category_1)
                    .split(",")
                    .map((item: any, ind: number) => (
                      <Chip
                        label={item}
                        variant="outlined"
                        key={ind}
                        sx={{ height: "25px" }}
                        style={{
                          color: "linear-gradient(#ff5757,#8c52ff)",
                        }}
                      />
                    ))}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-row md:flex-col w-full">
                <div className="mt-[1em] w-1/2 md:w-fit">
                  <p className="font-bold  text-black">Typical Job Cost</p>
                  <p className="">
                    {vendorData?.average_project_value ?? "N/A"}
                  </p>
                </div>
                <div className="mt-[1em] w-1/2 md:w-fit">
                  <p className="font-bold  text-black">Number of Employees</p>
                  <p className="">{vendorData?.number_of_employees ?? "N/A"}</p>
                </div>
              </div>
              <div className="flex  w-full flex-row md:flex-col mt-[1em]">
                <div className="w-1/2 md:w-fit">
                  <p className="font-bold  text-black">Projects Completed</p>
                  <p className="">{vendorData?.projects_completed ?? "N/A"}</p>
                </div>
                <div className=" w-1/2 md:w-fit mt-[1em]">
                  <p className="font-bold  text-black">Location</p>
                  <p className="">{vendorData?.city ?? "N/A"}</p>
                </div>
              </div>
              <div className="flex  w-full mt-[1em]">
                {(vendorData?.social?.facebook ||
                  vendorData?.social?.instagram ||
                  vendorData?.social?.website) && (
                  <div className="w-1/2">
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
                <div className="w-1/2 md:w-fit">
                  <p className="font-bold text-black">Contact Number</p>
                  <p className="">{vendorData?.mobile ?? "N/A"}</p>
                </div>
              </div>
              <div className="w-full mt-[1em]">
                <p className="font-bold  text-black">Email</p>
                <p className="">{vendorData?.email ?? "N/A"}</p>
              </div>
              <div className="md:hidden w-full ">
                <p className="font-bold  text-black">About</p>
                <p className=" text-justify mb-[1em] rounded-md">
                  {contentPreview}
                  {ismobile &&
                    vendorData?.description.length! > maxVisibleLength && (
                      <button
                        onClick={handleExpandClick}
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        {expanded ? "Read Less" : "Read More"}
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

  return isMobile ? (
    <div className="border border-1 m-3 rounded-md border-[#d3d8e0] w-[90vw]">
      {content}
    </div>
  ) : (
    <div>{content}</div>
  );
};

export default Section;
