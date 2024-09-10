import { useState, useContext, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Login";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import JoinAsPro from "../pages/JoinAsPro";
import Avatar from "@mui/material/Avatar";
import { deepOrange, grey } from "@mui/material/colors";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import constants from "../constants";
import pickelelogo from "../assets/PickeleLogo.png";
import { Button as MaterialButton } from "@mui/material";

const Navbar: React.FC = () => {
  const [isDivVisible, setIsDivVisible] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (divRef.current && !divRef.current.contains(event.target as Node)) {
      setIsDivVisible(false);
    }
  };
  useEffect(() => {
    if (isDivVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDivVisible]);

  const authContext = useContext(AuthContext);

  if (authContext === undefined) {
    return;
  }
  const { setLogin, userDetails, login } = authContext;
  const [toggleProfileMenu, setToggleProfileMenu] = useState(false);
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const result = await axios.delete(`${constants.apiBaseUrl}/user/logout`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (result) {
        setToggleProfileMenu(false);
        setLogin(false);
        sessionStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {}
  };

  const [open, setOpen] = useState(false);

  const handleClose = (
    _?: React.SyntheticEvent<Element, Event>,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) {
      return;
    }
    setOpen(false);
  };
  return (
    <div className="navBar flex justify-between p-[12px] fixed bg-prim w-screen top-0 items-center z-[1000] text-text text-lg sm:px-[64px]">
      <div className="flex items-center gap-4">
        <div className="logo">
          <Link to="/" className="text-[purple]">
            <img src={pickelelogo} alt="Pickele" className="h-10 w-auto" />
          </Link>
        </div>
      </div>
      {login ? (
        <div className="flex gap-4 items-center">
          {userDetails?.is_vendor ? (
            ""
          ) : (
            <div>
              <MaterialButton
                variant="outlined"
                style={{ borderColor: "#8c52ff", color: "#8c52ff" }}
                onClick={() => setOpen(true)}
              >
                Join as Pro
              </MaterialButton>
            </div>
          )}
          <div className={`p-[6px] mr-2 `}>
            <div>
              <Button
                onClick={() => {
                  setToggleProfileMenu(
                    (toggleProfileMenu) => !toggleProfileMenu
                  );
                  setIsDivVisible(true);
                }}
              >
                <Avatar sx={{ bgcolor: grey[400] }}>
                  {`${userDetails?.first_name[0]}${userDetails?.last_name[0]}`}
                </Avatar>
              </Button>
            </div>
            <div
              className={
                toggleProfileMenu && isDivVisible
                  ? "fixed bg-[#f3f1f1] w-[250px] sm:w-[400px] text-text right-1 flex flex-col items-center justify-center top-[76px] rounded-[10px] "
                  : "hidden"
              }
              style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
              ref={divRef}
            >
              <p className=" mt-3">{userDetails?.email}</p>
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
              <p className="text-2xl pb-[16px]">
                Hi {userDetails?.first_name}!!
              </p>

              <div className="mt-[1em]">
                <div className="flex flex-col items-center bg-white justify-center sm:w-[370px] rounded-[10px] p-2 mb-2">
                  {userDetails?.is_vendor ? (
                    <div className="">
                      <NavLink
                        to={"/profile"}
                        className="text-text p-1 rounded-[8px] flex items-center gap-2 w-[220px] sm:w-[350px] hover:bg-[#f3f1f1] transition-all"
                        onClick={() => setToggleProfileMenu(false)}
                      >
                        <AccountCircleIcon /> <p>View Profile</p>
                      </NavLink>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="flex h-[40px]">
                    <Button
                      variant="outlined"
                      style={{ backgroundColor: "#8c52ff", color: "white" }}
                      onClick={() => {
                        setToggleProfileMenu(false);
                        setLogin(false);
                        handleLogout();
                      }}
                    >
                      <LogoutIcon /> <p>Log Out</p>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 pr-5">
          <MaterialButton
            variant="outlined"
            style={{ color: "black", borderColor: "black" }}
            onClick={() => navigate("/login")}
          >
            Log In
          </MaterialButton>
          <MaterialButton
            variant="outlined"
            style={{ backgroundColor: "#8c52ff", color: "white" }}
            onClick={() => navigate("/signup")}
          >
            Join
          </MaterialButton>
        </div>
      )}
      <Dialog
        open={open}
        onClose={() => handleClose}
        sx={{ margin: "auto" }}
        fullScreen={isFullScreen}
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

export default Navbar;
