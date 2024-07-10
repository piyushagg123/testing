import { useContext, useEffect, useState } from "react";
import img from "../assets/background.jpg";

import reviewImage from "../assets/noReviewsAdded.png";

import { FaFacebook, FaInstagram, FaExternalLinkAlt } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { FaSquareXTwitter } from "react-icons/fa6";

import { Dialog, DialogContent, IconButton } from "@mui/material";
import AddAProject from "../components/AddAProject";
import ProjectImages from "../components/ProjectImages";

import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/Login";
const Profile = () => {
  const { setLogin } = useContext(AuthContext);
  const [about, setAbout] = useState(true);
  const [projects, setProjects] = useState(false);
  const [reviews, setReviews] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.get(
          `https://designmatch.ddns.net/vendor/auth/details`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        setData(response.data.data);

        setIsLoading(false);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLogin(false);
        navigate("/error");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Review:", review);
    console.log("Rating:", rating);
    setShowModal(false);
  };

  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const handleClose = () => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
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

  const [projectsData, setProjectsData] = useState([]);

  if (isLoading) return;
  else if (!data) {
    return (
      <>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <p>Session has expired</p>
      </>
    );
  }
  return (
    <div className="mt-[70px] text-text h-screen flex  justify-center gap-3">
      <div className="text-[10px] md:text-[16px]  flex flex-col gap-7 md:gap-0 pl-4">
        <br />

        <div className="w-[310px] md:w-max">
          <br />
          <div className="flex items-end gap-3">
            <div>
              {data.logo ? (
                <img
                  src={`https://designmatch-s3-bucket.s3.ap-south-1.amazonaws.com/${data.logo}`}
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
              <p>
                <span className="font-bold">Profession:</span>{" "}
                {formatCategory(data.category)}
              </p>
              <p>
                <span className="font-bold">Themes:</span>{" "}
                {formatCategory(data.sub_category_1)}
              </p>
              <p>
                <span className="font-bold">Spaces:</span>{" "}
                {formatCategory(data.sub_category_2)}
              </p>
            </div>
          </div>
          <br />

          <div className="flex gap-3">
            <div></div>
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
            className={`${
              about ? "block" : "hidden"
            } md:w-[500px] lg:w-[750px] xl:w-[950px]`}
          >
            <br />
            <p>{data.description}</p>
            <br />
          </div>
          <div
            className={`${
              projects ? "block" : "hidden"
            }  md:w-[500px] lg:w-[750px] xl:w-[950px] flex justify-center flex-col items-center`}
          >
            <br />
            <div className="flex w-full justify-end">
              <button
                className="flex items-center gap-2 p-2 border-text border-[2px] text-text bg-prim hover:bg-sec hover:border-text rounded-[5px]"
                onClick={() => setOpen(true)}
              >
                <IoMdAddCircle /> Add a new project
              </button>
            </div>
            <br />
            <div className="flex flex-wrap gap-10 justify-between"></div>
            <br />

            <br />
            <br />
          </div>
          <div
            className={`${
              reviews ? "block" : "hidden"
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
            <p className="font-bold">Business Name</p>
            <p className="text-[16px]">{data.business_name}</p>
          </div>
          <div className=" ">
            <p className="font-bold">Typical Job Cost</p>
            <p className="text-[16px]">{data.average_project_value}</p>
          </div>
          <div className=" ">
            <p className="font-bold">Number of employees</p>
            <p className="text-[16px]">{data.number_of_employees}</p>
          </div>
          <div className=" ">
            <p className="font-bold">Projects Completed</p>
            <p className="text-[16px]">{data.projects_completed}</p>
          </div>

          <div className=" ">
            <p className="font-bold">Contact Number</p>
            <p className="text-[16px]">{data.mobile}</p>
          </div>
          <div className=" ">
            <p className="font-bold">Socials</p>
            <div className="flex gap-3 text-[16px]">
              <a href="">
                <FaFacebook />
              </a>
              <a href="">
                <FaInstagram />
              </a>
              <a href="">
                <FaSquareXTwitter />
              </a>
            </div>
          </div>

          <div className=" ">
            <p className="font-bold">Address</p>
            <p className="text-[16px]">
              {data.address} <br />
              {data.city} <br />
              {data.state}
            </p>
          </div>
          <div className=" ">
            <p className="font-bold">Website</p>
            <a
              href="https://homezdesigners.com/"
              className="flex items-center gap-1 text-[16px]"
            >
              homezdesigners.com <FaExternalLinkAlt />
            </a>
          </div>

          <div className=" ">
            <p className="font-bold">Email</p>
            <a
              href={`mailto:${data.email}`}
              className="flex items-center gap-1 text-[16px]"
            >
              {data.email} <FaExternalLinkAlt />
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
              <AddAProject handleClose={handleClose} />{" "}
            </>
          ) : (
            <>
              <ProjectImages
                subCategories={selectedSubCategories}
                handleClose={handleClose}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
