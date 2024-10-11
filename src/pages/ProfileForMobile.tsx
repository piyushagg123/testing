import { Avatar, Button } from "@mui/material";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import constants from "../constants";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/Login";
import { deepOrange } from "@mui/material/colors";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const ProfileForMobile = () => {
  const authContext = useContext(AuthContext);

  if (authContext === undefined) {
    return;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { setLogin, userDetails } = authContext;
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const result = await axios.delete(`${constants.apiBaseUrl}/user/logout`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (result) {
        setLogin(false);
        sessionStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {}
  };
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <p className="mt-28 ">{userDetails?.email}</p>
        <Avatar
          sx={{
            bgcolor: deepOrange[500],
            height: 80,
            width: 80,
            marginTop: 2,
          }}
        >
          {`${userDetails?.first_name[0]}${userDetails?.last_name[0]}`}
        </Avatar>
        <p className="text-2xl pb-[16px]">Hi {userDetails?.first_name}!!</p>

        <div className="mt-[1em]">
          <div className="flex flex-col  items-center bg-white justify-center sm:w-[370px] rounded-[10px] p-2 mb-2">
            {userDetails?.is_vendor ? (
              <div className="">
                <NavLink
                  to={"/profile"}
                  className="text-text p-1 rounded-[8px] flex items-center gap-2 w-[95vw] sm:w-[350px] hover:bg-[#f3f1f1] transition-all"
                >
                  <AccountCircleIcon /> <p>View Profile</p>
                </NavLink>
              </div>
            ) : (
              ""
            )}

            <div className="flex h-[40px] w-[95vw] justify-start items-start">
              <Button
                variant="text"
                style={{
                  color: "red",
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
                onClick={handleLogout}
              >
                <LogoutIcon /> <p>Log Out</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForMobile;
