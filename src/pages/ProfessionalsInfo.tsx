import React, { useState } from "react";
import img from "../assets/background.jpg";
import projectImage from "../assets/noProjectAdded.jpg";
import reviewImage from "../assets/noReviewsAdded.png";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Dialog, DialogContent } from "@mui/material";
import AddAProject from "../components/AddAProject";
import ProjectImages from "../components/ProjectImages";
import Carousel from "../components/Carousel";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import config from "../config";

const fetchVendorDetails = async (id) => {
  const { data } = await axios.get(
    `${config.apiBaseUrl}/vendor/details?vendor_id=${id}`
  );
  console.log(data.data);

  return data.data;
};

const fetchVendorProjects = async (id) => {
  const { data } = await axios.get(
    `${config.apiBaseUrl}/vendor/project/details?vendor_id=${id}`
  );
  return data.data;
};

const ProfessionalsInfo = () => {
  const [about, setAbout] = useState(true);
  const [projects, setProjects] = useState(false);
  const [reviews, setReviews] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const { id } = useParams();
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: vendorData, isLoading: isVendorLoading } = useQuery(
    ["vendorDetails", id],
    () => fetchVendorDetails(id)
  );

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery(
    ["vendorProjects", id],
    () => fetchVendorProjects(id)
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowModal(false);
  };

  const handleClose = () => {
    setOpen(false);
    setIsSubmitted(false);
    setSelectedSubCategories([]);
  };

  const handleFormSubmit = (subCategories) => {
    setSelectedSubCategories(subCategories);
    setIsSubmitted(true);
  };

  const formatCategory = (str) => {
    let formattedStr = str.replace(/_/g, " ");
    formattedStr = formattedStr
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return formattedStr;
  };

  if (isVendorLoading || isProjectsLoading) return <div>Loading...</div>;

  return (
    <div className="mt-[70px] text-text h-screen flex  justify-center gap-3">
      <div className="text-[10px] md:text-[16px] flex flex-col gap-7 md:gap-0 pl-4">
        <br />
        <div className="w-[310px] md:w-max">
          <br />
          <div className="flex items-end gap-3">
            <div>
              {vendorData.logo ? (
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
              <p>{ }</p>
              <p>
                <span className="font-bold">Profession:</span>{" "}
                {formatCategory(vendorData.category)}
              </p>
              <p>
                <span className="font-bold">Themes:</span>{" "}
                {formatCategory(vendorData.sub_category_1)}
              </p>
              <p>
                <span className="font-bold">Spaces:</span>{" "}
                {formatCategory(vendorData.sub_category_2)}
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
              className={`${about ? "border-b-[2px] border-black" : ""}`}
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
            className={`${about ? "block" : "hidden"
              } md:w-[500px] lg:w-[750px] xl:w-[950px]`}
          >
            <br />
            <p>{vendorData.description}</p>
            <br />
          </div>
          <div
            className={`${projects ? "block" : "hidden"
              }  md:w-[500px] lg:w-[750px] xl:w-[950px] flex justify-center flex-col items-center`}
          >
            <br />
            <div className="flex w-[100%] flex-wrap gap-10 justify-between">
              {!projectsData ? (
                <>
                  <div className="flex flex-col">
                    <div className="">
                      <img src={projectImage} alt="" className="w-[300px]" />
                    </div>
                    <br />
                    <p className="">No projects added yet by the designer</p>
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
                      desc={item.description}
                      city={item.city}
                      spaces={item.sub_category_2}
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
            className={`${reviews ? "block" : "hidden"
              }  md:w-[500px] lg:w-[750px] xl:w-[950px] flex justify-center flex-col items-center`}
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
        </div>
      </div>
      <br />
      <div className="w-[200px] text-lg ml-10">
        <br />
        <br />
        <div className="flex flex-col justify-evenly gap-6">
          <div className=" ">
            <p className="font-bold text-darkgrey">Business Name</p>
            <p className="text-[16px]">{vendorData.business_name}</p>
          </div>
          <div className=" ">
            <p className="font-bold">Typical Job Cost</p>
            <p className="text-[16px]">{vendorData.average_project_value}</p>
          </div>
          <div className=" ">
            <p className="font-bold">Number of employees</p>
            <p className="text-[16px]">{vendorData.number_of_employees}</p>
          </div>
          <div className=" ">
            <p className="font-bold">Projects Completed</p>
            <p className="text-[16px]">{vendorData.projects_completed}</p>
          </div>
          <div className=" ">
            <p className="font-bold">Contact Number</p>
            <p className="text-[16px]">{vendorData.mobile}</p>
          </div>
          <div className=" ">
            <p className="font-bold">Email</p>
            <p className="text-[16px]">{vendorData.email}</p>
          </div>
          <div className=" ">
            <p className="font-bold">Location</p>
            <p className="text-[16px]">{vendorData.city}</p>
          </div>
          {vendorData.social ? (
            <>
              <div>
                <p className="font-bold">Socials</p>
                {vendorData.social && vendorData.social.facebook && (
                  <a
                    href={vendorData.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FacebookIcon />
                  </a>
                )}
                {vendorData.social && vendorData.social.instagram && (
                  <a
                    href={vendorData.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {vendorData.social && vendorData.social.website && (
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
          ) : (
            <></>
          )}
        </div>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogContent>
            {isSubmitted ? (
              <ProjectImages
                vendorId={id}
                subCategories={selectedSubCategories}
                handleClose={handleClose}
              />
            ) : (
              <AddAProject vendorId={id} onSubmit={handleFormSubmit} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfessionalsInfo;
