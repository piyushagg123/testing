import { Link, useNavigate } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import { Alert, TextField } from "@mui/material";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../context/Login";
import axios from "axios";
import CryptoJS from "crypto-js";
import constants from "../constants";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";

const Login = () => {
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    return;
  }
  const { setLogin, setUserDetails } = authContext;
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [openForgotPassword, setOpenForgotPassword] = useState(true);

  const isEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const isMobile = (input: string): boolean => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(input);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const emailOrMobile = formData.get("emailOrMobile") as string;
    const password = formData.get("password") as string;

    if (!emailOrMobile) {
      setError("Please enter your email or mobile number.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    let data: { email?: string; mobile?: string; password: string } = {
      password: CryptoJS.SHA1(password).toString(),
    };
    if (isEmail(emailOrMobile)) {
      data.email = emailOrMobile;
    } else if (isMobile(emailOrMobile)) {
      data.mobile = emailOrMobile;
    } else {
      setError("Please enter a valid email or mobile number.");
      return;
    }

    data.password = CryptoJS.SHA1(password).toString();

    try {
      const response = await axios.post(
        `${constants.apiBaseUrl}/user/login`,
        data
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
      navigate("/");
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };
  return (
    <>
      {window.scrollTo(0, 0)}
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        {openForgotPassword ? (
          <div className="mt-28">
            <p className=" m-auto w-fit">
              Dont have an account?
              <span className="ml-3">
                <Link to={"/signup"} className="text-purple">
                  Sign in
                </Link>
              </span>
            </p>
            <br />
            <br />

            <div className="w-fit m-auto p-2 md:p-8 ">
              <h1 className="text-2xl md:text-3xl text-center font-bold text-purple">
                Log in to your account
              </h1>
              <br />
              <br />
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    width: "300px",
                    padding: "2px",
                    marginBottom: "5px",
                  }}
                >
                  {" "}
                  {error}
                </Alert>
              )}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center"
              >
                <TextField
                  label="Email or mobile number"
                  id="emailOrMobile"
                  name="emailOrMobile"
                  size="small"
                  sx={{ width: "300px" }}
                />
                <br />
                <label>
                  <div className="flex justify-end text-sm w-[300px]">
                    <p
                      onClick={() => setOpenForgotPassword(false)}
                      className="cursor-pointer text-purple"
                    >
                      Forgot your password
                    </p>
                  </div>{" "}
                  <TextField
                    id="password"
                    name="password"
                    size="small"
                    label="Password"
                    type="password"
                    sx={{ width: "300px" }}
                  />
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
              </form>
            </div>
          </div>
        ) : (
          <div className="mt-28 p-3 py-16">
            <ForgotPassword setOpenForgotPassword={setOpenForgotPassword} />
          </div>
        )}
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
      </div>
    </>
  );
};

export default Login;
