import axios from "axios";
import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Login";
import CryptoJS from "crypto-js";
import ForgotPassword from "../components/ForgotPassword";
// import https from "https";

const Login = () => {
  const navigate = useNavigate();
  const { setLogin, userDetails, setUserDetails } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const isMobile = (input) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailOrMobile) {
      setError("Please enter your email or mobile number.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    let data = {};
    if (isEmail(formData.emailOrMobile)) {
      data.email = formData.emailOrMobile;
    } else if (isMobile(formData.emailOrMobile)) {
      data.mobile = formData.emailOrMobile;
    } else {
      setError("Please enter a valid email or mobile number.");
      return;
    }

    data.password = CryptoJS.SHA1(formData.password).toString();

    try {
      const response = await axios.post(
        "https://designmatch.ddns.net/user/login",
        data
      );

      sessionStorage.setItem("token", response.data.access_token);
      const user_data = await axios.get(
        "https://designmatch.ddns.net/user/details",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setUserDetails(user_data.data);
      setLogin(true);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.response.data.debug_info);
    }
  };

  return (
    <div className="mt-16">
      <div className=" lg:h-screen h-full flex flex-col">
        <div
          className="w-fit m-auto p-8"
          style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
        >
          <h1 className="text-2xl md:text-3xl text-center">
            Log in to your account
          </h1>
          <br />
          {error && (
            <div className="text-red-500 w-[320px] mb-1 text-center bg-[#ff000020] p-1 border border-[red]">
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center"
          >
            <label className="text-sm">
              Email or Mobile number <br />
              <input
                type="text"
                id="emailOrMobile"
                name="emailOrMobile"
                value={formData.emailOrMobile}
                onChange={handleChange}
                className="w-[320px] h-10 mt-1 px-2 rounded-[5px]"
              />
            </label>
            <br />
            <label>
              <div className="flex justify-between text-sm w-[320px]">
                <p>Password</p>
                <p>
                  <ForgotPassword />
                </p>
              </div>{" "}
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-[320px] h-10 mt-1 px-2 rounded-[5px]"
              />
              <br />
              <br />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="p-2 w-[250px] rounded-[5px] border-text border-[2px] text-text bg-prim hover:bg-text hover:text-prim hover:border-text"
                >
                  Continue
                </button>
              </div>
            </label>
          </form>
          <br />
          <p className="text-center">
            Don't have an account{" "}
            <NavLink to="/signup" className="underline">
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
