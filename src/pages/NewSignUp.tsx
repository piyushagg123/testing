import { FormEvent, useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import axios from "axios";
import { AuthContext } from "../context/Login";
import CryptoJS from "crypto-js";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import JoinAsPro from "./JoinAsPro";
import { Alert, IconButton } from "@mui/material";
import constants from "../constants";

interface FormObject {
  [key: string]: string;
}

const NewSignUp = () => {
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    return;
  }
  const { setLogin, setUserDetails } = authContext;
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const formObject: FormObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value.toString();
    });

    if (!formObject.first_name) {
      setError("Please enter your first name.");
      return;
    }

    if (!formObject.last_name) {
      setError("Please enter your last name.");
      return;
    }

    if (!formObject.email) {
      setError("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!formObject.mobile) {
      setError("Please enter your mobile number.");
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formObject.mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (!formObject.password) {
      setError("Please enter your password.");
      return;
    }

    formObject.password = CryptoJS.SHA1(formObject.password).toString();
    try {
      const response = await axios.post(
        `${constants.apiBaseUrl}/user/register`,
        formObject
      );

      sessionStorage.setItem("token", response.data.access_token);
      const user_data = await axios.get(
        `${constants.apiBaseUrl}/user/details`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setUserDetails(user_data.data.data);

      setLogin(true);

      if (isChecked) {
        setOpen(true);
      } else {
        navigate("/");
      }
    } catch (error: any) {
      setError(error.response?.data?.debug_info ?? "An error occurred");
    }
  };
  const handleClose = (
    _event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setOpen(false);
    navigate("/");
  };
  return (
    <div className="grid grid-cols-2 h-full">
      <div className="bg-purple py-28 text-white px-36">
        <br />
        <br />
        <br />
        <br />
        <h1 className="text-xl md:text-3xl font-bold">
          Join today to recreate your home
        </h1>
        <br />
        <br />
        <div className="flex items-center">
          <LabelImportantIcon className="text-sm" />
          <p>Explore vast selection of ideas</p>
        </div>
        <br />
        <div className="flex items-center">
          <LabelImportantIcon className="text-sm" />
          <p>Get matched with best interior designers near you</p>
        </div>
        <br />
        <div className="flex items-center">
          <LabelImportantIcon className="text-sm" />
          <p>Sit back, relax and get your home recreated.</p>
        </div>
      </div>
      <div className="mt-28">
        <p className=" m-auto w-fit">
          Already have an account?
          <span className="ml-3">
            <Link to={"/login"} className="text-purple">
              Log in
            </Link>
          </span>
        </p>
        <div className="w-fit m-auto p-[1rem] md:p-8 flex flex-col justify-center items-center ">
          <h1 className="text-2xl md:text-3xl text-center font-bold text-purple">
            Sign up for your account
          </h1>
          <br />
          {error && (
            <Alert
              severity="error"
              sx={{
                width: "320px",
                padding: "2px",
                marginBottom: "5px",
              }}
            >
              {error}
            </Alert>
          )}
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="text-sm">
              First name <br />
              <input
                type="text"
                className="w-[270px] md:w-[320px] h-10 mt-1 px-2 rounded-[5px]"
                id="first_name"
                name="first_name"
              />
            </label>

            <br />
            <label className="text-sm">
              Last name <br />
              <input
                type="text"
                className="w-[270px] md:w-[320px] h-10 mt-1 px-2 rounded-[5px]"
                id="last_name"
                name="last_name"
              />
            </label>
            <br />
            <label className="text-sm">
              Mobile number <br />
              <input
                type="number"
                className="w-[270px] md:w-[320px] h-10 mt-1 px-2 rounded-[5px]"
                id="mobile"
                name="mobile"
              />
            </label>
            <br />
            <label className="text-sm">
              Email <br />
              <input
                type="text"
                id="email"
                name="email"
                className="w-[270px] md:w-[320px] h-10 mt-1 px-2 rounded-[5px]"
              />
            </label>
            <br />
            <label>
              <div className="flex justify-between text-sm w-[270px] md:w-[320px] rounded-[5px]">
                <p>Password</p>
              </div>{" "}
              <input
                type="password"
                id="password"
                name="password"
                className="w-[270px] md:w-[320px] h-10 mt-1 px-2 rounded-[5px]"
              />
              <br />
              <br />
              <label htmlFor="" className="flex items-start gap-2">
                <div>
                  <input
                    type="checkbox"
                    name="join_as_pro"
                    id="join_as_pro"
                    checked={isChecked}
                    onChange={(event) => setIsChecked(event.target.checked)}
                  />
                </div>{" "}
                <div>Join as pro</div>
              </label>
              <br />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="p-2 w-[250px] rounded-[5px]  text-white bg-purple  "
                >
                  Continue
                </button>
              </div>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewSignUp;
