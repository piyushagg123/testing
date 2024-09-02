import { FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import axios from "axios";
import { AuthContext } from "../context/Login";
import CryptoJS from "crypto-js";
import JoinAsPro from "./JoinAsPro";
import { Alert, TextField } from "@mui/material";
import constants from "../constants";

interface FormObject {
  [key: string]: string;
}

const SignUp = () => {
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    return;
  }
  const { setLogin, setUserDetails } = authContext;
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [openJoinasPro, setOpenJoinasPro] = useState<boolean>(true);

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
        // setOpen(true);
        setOpenJoinasPro(false);
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
    navigate("/");
  };
  return (
    <>
      {window.scrollTo(0, 0)}
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="hidden md:block bg-purple p-12 lg:py-28 text-white lg:px-36">
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
          {openJoinasPro ? (
            <div className="w-fit m-auto md:p-8 flex flex-col justify-center items-center ">
              <h1 className="text-2xl md:text-3xl text-center font-bold text-purple">
                Sign up for your account
              </h1>
              <br />
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    width: "300px",
                    padding: "2px",
                    marginBottom: "10px",
                  }}
                >
                  {error}
                </Alert>
              )}
              <form className="flex flex-col" onSubmit={handleSubmit}>
                <TextField
                  label="First name"
                  id="first_name"
                  name="first_name"
                  size="small"
                  sx={{ width: "300px" }}
                />
                <br />

                <TextField
                  label="Last name"
                  id="last_name"
                  name="last_name"
                  size="small"
                  sx={{ width: "300px" }}
                />
                <br />

                <TextField
                  label="Mobile number"
                  id="mobile"
                  name="mobile"
                  type="number"
                  size="small"
                  sx={{ width: "300px" }}
                />
                <br />

                <TextField
                  label="Email"
                  id="email"
                  name="email"
                  size="small"
                  sx={{ width: "300px" }}
                />
                <br />
                <label>
                  <TextField
                    label="Password"
                    type="password"
                    id="password"
                    name="password"
                    size="small"
                    sx={{ width: "300px" }}
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
                      className="p-2 mb-2 w-[250px] rounded-[5px]  text-white bg-purple  "
                    >
                      Continue
                    </button>
                  </div>
                </label>
              </form>
            </div>
          ) : (
            <JoinAsPro handleClose={handleClose} />
          )}
        </div>
      </div>
    </>
  );
};

export default SignUp;
