import { useState } from "react";
import img from "../assets/background.jpg";
import projectImage from "../assets/noProjectAdded.jpg";
import reviewImage from "../assets/noReviewsAdded.png";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import Carousel from "../components/Carousel";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import config from "../config";
import Reviews from "../components/Reviews";

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

const ProfessionalsInfo: React.FC = () => {
  const [about, setAbout] = useState(true);
  const [projects, setProjects] = useState(false);
  const [reviews, setReviews] = useState(false);
  const { id } = useParams<{ id: string }>();

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
      .toUpperCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return formattedStr;
  };

  if (isVendorLoading || isProjectsLoading) return <div>Loading...</div>;

  return (
    <div className="mt-[70px] text-text h-screen flex justify-center gap-3">
      <div className="text-[10px] md:text-[16px] flex flex-col gap-7 md:gap-0 pl-4">
        <br />
        <div className="w-[310px] md:w-max">
          <br />
          <div className="flex gap-3">
            <div>
              {vendorData?.logo ? (
                <img
                  src={`${config.apiImageUrl}/${vendorData.logo}`}
                  alt="Vendor Logo"
                  className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full"
                />
              ) : (
                <img
                  src={img}
                  alt="Default Logo"
                  className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold text-base text-darkgrey">
                {formatCategory(
                  vendorData?.business_name ?? "Unknown Business"
                )}
              </p>
              <p>
                <span className="font-bold text-sm text-darkgrey">
                  SPECIALIZED THEMES :{" "}
                </span>{" "}
                {formatCategory(vendorData?.sub_category_1 ?? "N/A")}
              </p>
              <p>
                <span className="font-bold text-sm text-darkgrey">
                  SPECIALIZED SPACES :
                </span>{" "}
                {formatCategory(vendorData?.sub_category_2 ?? "N/A")}
              </p>
            </div>
          </div>
          <br />
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
          <div className="flex gap-3 text-[18px] border-b-[0.3px] border-black">
            <button
              className={`${about ? "border-b-[2px] border-red" : ""}`}
              onClick={() => {
                setAbout(true);
                setProjects(false);
                setReviews(false);
              }}
            >
              About Us
            </button>
            <button
              className={`${projects ? "border-b-[2px] border-black" : ""}`}
              onClick={() => {
                setAbout(false);
                setProjects(true);
                setReviews(false);
              }}
            >
              Projects
            </button>
            <button
              className={`${reviews ? "border-b-[2px] border-black" : ""}`}
              onClick={() => {
                setAbout(false);
                setProjects(false);
                setReviews(true);
              }}
            >
              Reviews
            </button>
          </div>
          <div
            className={`${
              about ? "block" : "hidden"
            } md:w-[500px] lg:w-[750px] xl:w-[950px]`}
          >
            <br />
            <p>{vendorData?.description}</p>
            <br />
          </div>
          <div
            className={`${
              projects ? "block" : "hidden"
            }  md:w-[500px] lg:w-[750px] xl:w-[950px] flex justify-center flex-col items-center`}
          >
            <br />
            <div className="flex w-[100%] flex-wrap gap-10 justify-center ">
              {!projectsData || projectsData.length === 0 ? (
                <>
                  <div className="flex flex-col ">
                    <div>
                      <img
                        src={projectImage}
                        alt="No Projects"
                        className="w-[300px]"
                      />
                    </div>
                    <br />
                    <p>No projects added yet by the designer</p>
                    <br />
                  </div>
                </>
              ) : (
                <>
                  {projectsData.map((item, ind) => (
                    <Carousel
                      key={ind}
                      imageObj={item.images}
                      title={item.title}
                      city={item.city}
                      state={item.state}
                      theme={item.sub_category_1}
                    />
                  ))}
                </>
              )}
            </div>
            <br />
            <br />
            <br />
          </div>
          <div
            className={`${
              reviews ? "block" : "hidden"
            }  md:w-[500px] lg:w-[750px] xl:w-[950px]`}
          >
            {/* <br />
            <div className="">
              <img src={reviewImage} alt="No Reviews" className="w-[300px]" />
            </div>
            <br />
            <p>No reviews added yet!!</p>
            <br />
            <br />
            <br /> */}
            <Reviews />
          </div>
        </div>
      </div>
      <br />
      <div className="w-[200px] text-lg ml-10">
        <br />
        <br />
        <div className="flex flex-col justify-evenly gap-6">
          <div className=" ">
            <p className="font-bold text-base text-darkgrey">Business Name</p>
            <p className="text-[16px]">
              {vendorData?.business_name ?? "Unknown"}
            </p>
          </div>
          <div className=" ">
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
            <p className="font-bold text-base text-darkgrey">Contact Number</p>
            <p className="text-[16px]">{vendorData?.mobile ?? "N/A"}</p>
          </div>
          <div className=" ">
            <p className="font-bold text-base text-darkgrey">Email</p>
            <p className="text-[16px]">{vendorData?.email ?? "N/A"}</p>
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
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsInfo;
