import process from "process";
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLabelImportant } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../context/Login";
import CryptoJS from "crypto-js";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import JoinAsPro from "./JoinAsPro";
import { IconButton } from "@mui/material";

const SignUp = () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const { setLogin, setUserDetails } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.first_name) {
      setError("Please enter your first name.");
      return;
    }

    if (!formData.last_name) {
      setError("Please enter your last name.");
      return;
    }

    if (!formData.email) {
      setError("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!formData.mobile) {
      setError("Please enter your mobile number.");
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    formData.password = CryptoJS.SHA1(formData.password).toString();

    try {
      const response = await axios.post(
        `https://designmatch.ddns.net/user/register`,
        formData
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

      if (isChecked) {
        setOpen(true);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.response.data.debug_info);
    }
  };

  const handleClose = (reason) => {
    if (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) {
      return;
    }
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="mt-16">
      <div className="flex justify-center flex-wrap h-full lg:h-full py-5">
        <div className="p-3 md:p-6 text-[13px] md:text-xl md:mr-4 gap-2 mb-4 md:mb-0">
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
            <MdLabelImportant className="text-sm" />
            <p>Explore vast selection of ideas</p>
          </div>
          <br />
          <div className="flex items-center">
            <MdLabelImportant className="text-sm" />
            <p>Get matched with best interior designers near you</p>
          </div>
          <br />
          <div className="flex items-center">
            <MdLabelImportant className="text-sm" />
            <p>Sit back, relax and get your home recreated.</p>
          </div>
        </div>
        <div
          className="w-fit p-[1rem] md:p-8 flex flex-col"
          style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
        >
          <h1 className="text-2xl md:text-3xl text-center">
            Sign up for your account
          </h1>
          <br />
          {error && (
            <div className="text-red-500 w-[320px] mb-1 text-center bg-[#ff000020] p-1 border border-[red]">
              {error}
            </div>
          )}
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="text-sm">
              First name <br />
              <input
                type="text"
                className="w-[320px] h-10 mt-1 px-2 rounded-[5px]"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </label>
            <br />
            <label className="text-sm">
              Last name <br />
              <input
                type="text"
                className="w-[320px] h-10 mt-1 px-2 rounded-[5px]"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </label>
            <br />
            <label className="text-sm">
              Mobile number <br />
              <input
                type="number"
                className="w-[320px] h-10 mt-1 px-2 rounded-[5px]"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </label>
            <br />
            <label className="text-sm">
              Email <br />
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-[320px] h-10 mt-1 px-2 rounded-[5px]"
              />
            </label>
            <br />
            <label>
              <div className="flex justify-between text-sm w-[320px] rounded-[5px]">
                <p>Password</p>
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
              <label htmlFor="" className="flex items-start gap-2">
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                </div>{" "}
                <div>Join as pro</div>
              </label>
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
            Already have an account{" "}
            <NavLink to={"/login"} className={"underline"}>
              Log in
            </NavLink>
          </p>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ width: "590px", margin: "auto" }}
        fullWidth
      >
        <DialogContent sx={{ height: "max-content", position: "relative" }}>
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
          <JoinAsPro handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignUp;
