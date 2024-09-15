// import { useState, useContext, useRef, useEffect } from "react";
// import { NavLink, Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/Login";
// import axios from "axios";
// import {
//   Button,
//   ButtonGroup,
//   ClickAwayListener,
//   Dialog,
//   DialogContent,
//   Grow,
//   IconButton,
//   MenuItem,
//   MenuList,
//   Paper,
//   Popper,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import JoinAsPro from "../pages/JoinAsPro";
// import Avatar from "@mui/material/Avatar";
// import { deepOrange, grey } from "@mui/material/colors";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import LogoutIcon from "@mui/icons-material/Logout";
// import constants from "../constants";
// import pickelelogo from "../assets/PickeleLogo.png";
// import { Button as MaterialButton } from "@mui/material";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import MenuIcon from "@mui/icons-material/Menu";

// const Navbar: React.FC = () => {
//   const [isDivVisible, setIsDivVisible] = useState(false);
//   const divRef = useRef<HTMLDivElement | null>(null);

//   const handleClickOutside = (event: MouseEvent) => {
//     if (divRef.current && !divRef.current.contains(event.target as Node)) {
//       setIsDivVisible(false);
//     }
//   };

//   const options = ["Login", "Join as interior designer", "Rebase and merge"];

//   const [openDrop, setOpenDrop] = useState(false);
//   const anchorRef = useRef<HTMLDivElement>(null);
//   const [selectedIndex, setSelectedIndex] = useState(1);

//   const handleClick = () => {
//     console.info(`You clicked ${options[selectedIndex]}`);
//   };

//   const handleMenuItemClick = (
//     event: React.MouseEvent<HTMLLIElement, MouseEvent>,
//     index: number
//   ) => {
//     setSelectedIndex(index);
//     setOpen(false);
//   };

//   const handleToggle = () => {
//     setOpenDrop((prevOpen) => !prevOpen);
//   };

//   const handleDropClose = (event: Event) => {
//     if (
//       anchorRef.current &&
//       anchorRef.current.contains(event.target as HTMLElement)
//     ) {
//       return;
//     }

//     setOpenDrop(false);
//   };
//   useEffect(() => {
//     if (isDivVisible) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isDivVisible]);

//   const authContext = useContext(AuthContext);

//   if (authContext === undefined) {
//     return;
//   }
//   const { setLogin, userDetails, login } = authContext;
//   const [toggleProfileMenu, setToggleProfileMenu] = useState(false);
//   const [toggleMenu, setToggleMenu] = useState(false);
//   const theme = useTheme();
//   const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   const navigate = useNavigate();
//   const handleLogout = async () => {
//     try {
//       const result = await axios.delete(`${constants.apiBaseUrl}/user/logout`, {
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//         },
//       });
//       if (result) {
//         setToggleProfileMenu(false);
//         setLogin(false);
//         sessionStorage.removeItem("token");
//         navigate("/");
//       }
//     } catch (error) {}
//   };

//   const [open, setOpen] = useState(false);

//   const handleClose = (
//     _?: React.SyntheticEvent<Element, Event>,
//     reason?: "backdropClick" | "escapeKeyDown"
//   ) => {
//     if (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) {
//       return;
//     }
//     setOpen(false);
//   };
//   return (
//     <div className="navBar flex justify-between p-[12px] fixed bg-prim w-screen top-0 items-center z-[1000] text-text text-lg sm:px-[64px]">
//       <div className="flex items-center gap-2 md:gap-4">
//         <div className="logo">
//           <Link to="/" className="text-[purple]">
//             <img src={pickelelogo} alt="Pickele" className="h-10 w-auto" />
//           </Link>
//         </div>
//       </div>
//       {login ? (
//         <div className="flex gap-4 items-center">
//           {userDetails?.is_vendor ? (
//             ""
//           ) : (
//             <div>
//               <MaterialButton
//                 variant="outlined"
//                 style={{
//                   borderColor: "#8c52ff",
//                   color: "#8c52ff",
//                   padding: "5px",
//                 }}
//                 onClick={() => navigate("/join-as-pro")}
//               >
//                 Join as Pro
//               </MaterialButton>
//             </div>
//           )}
//           <div className={`p-[6px] mr-2 `}>
//             <div>
//               <div
//                 className="cursor-pointer"
//                 onClick={() => {
//                   if (isFullScreen) {
//                     navigate("/profile-options");
//                   } else {
//                     setToggleProfileMenu(
//                       (toggleProfileMenu) => !toggleProfileMenu
//                     );
//                     setIsDivVisible(true);
//                   }
//                 }}
//               >
//                 <Avatar sx={{ bgcolor: grey[400] }}>
//                   {`${userDetails?.first_name[0]}${userDetails?.last_name[0]}`}
//                 </Avatar>
//               </div>
//             </div>
//             <div
//               className={
//                 toggleProfileMenu && isDivVisible
//                   ? "fixed bg-[#f3f1f1] w-screen h-screen sm:h-auto sm:w-[400px] text-text right-1 flex flex-col items-center sm:justify-center top-[76px] sm:rounded-[10px] "
//                   : "hidden"
//               }
//               style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
//               ref={divRef}
//             >
//               <p className="mt-16 sm:mt-3">{userDetails?.email}</p>
//               <Avatar
//                 sx={{
//                   bgcolor: deepOrange[500],
//                   height: 80,
//                   width: 80,
//                   marginTop: 2,
//                 }}
//               >
//                 {`${userDetails?.first_name[0]}${userDetails?.last_name[0]}`}
//               </Avatar>
//               <p className="text-2xl pb-[16px]">
//                 Hi {userDetails?.first_name}!!
//               </p>

//               <div className="mt-[1em]">
//                 <div className="flex flex-col items-center bg-white justify-center sm:w-[370px] rounded-[10px] p-2 mb-2">
//                   {userDetails?.is_vendor ? (
//                     <div className="">
//                       <NavLink
//                         to={"/profile"}
//                         className="text-text p-1 rounded-[8px] flex items-center gap-2 w-[95vw] sm:w-[350px] hover:bg-[#f3f1f1] transition-all"
//                         onClick={() => setToggleProfileMenu(false)}
//                       >
//                         <AccountCircleIcon /> <p>View Profile</p>
//                       </NavLink>
//                     </div>
//                   ) : (
//                     ""
//                   )}

//                   <div className="flex h-[40px]">
//                     <Button
//                       variant="outlined"
//                       style={{ backgroundColor: "#8c52ff", color: "white" }}
//                       onClick={() => {
//                         setToggleProfileMenu(false);
//                         setLogin(false);
//                         handleLogout();
//                       }}
//                     >
//                       <LogoutIcon /> <p>Log Out</p>
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="md:flex hidden  gap-4 pr-5">
//             <div className="hidden md:block">
//               <MaterialButton
//                 variant="outlined"
//                 style={{ color: "black", borderColor: "black" }}
//                 onClick={() => navigate("/login")}
//               >
//                 Log In
//               </MaterialButton>
//             </div>
//             <div>
//               <MaterialButton
//                 variant="outlined"
//                 style={{ backgroundColor: "#8c52ff", color: "white" }}
//                 onClick={() => navigate("/join-as-pro")}
//               >
//                 Join as interior designer
//               </MaterialButton>
//             </div>
//           </div>

//           <div className="block md:hidden">
//             <ButtonGroup
//               variant="contained"
//               ref={anchorRef}
//               aria-label="Button group with a nested menu"
//             >
//               <Button onClick={handleClick}>{options[selectedIndex]}</Button>
//               <Button
//                 size="small"
//                 aria-controls={open ? "split-button-menu" : undefined}
//                 aria-expanded={open ? "true" : undefined}
//                 aria-label="select merge strategy"
//                 aria-haspopup="menu"
//                 onClick={handleToggle}
//               >
//                 <ArrowDropDownIcon />
//               </Button>
//             </ButtonGroup>
//             <Popper
//               sx={{ zIndex: 1 }}
//               open={openDrop}
//               anchorEl={anchorRef.current}
//               role={undefined}
//               transition
//               disablePortal
//             >
//               {({ TransitionProps, placement }) => (
//                 <Grow
//                   {...TransitionProps}
//                   style={{
//                     transformOrigin:
//                       placement === "bottom" ? "center top" : "center bottom",
//                   }}
//                 >
//                   <Paper>
//                     <ClickAwayListener onClickAway={handleDropClose}>
//                       <MenuList id="split-button-menu" autoFocusItem>
//                         {options.map((option, index) => (
//                           <MenuItem
//                             key={option}
//                             disabled={index === 2}
//                             selected={index === selectedIndex}
//                             onClick={(event) =>
//                               handleMenuItemClick(event, index)
//                             }
//                           >
//                             {option}
//                           </MenuItem>
//                         ))}
//                       </MenuList>
//                     </ClickAwayListener>
//                   </Paper>
//                 </Grow>
//               )}
//             </Popper>
//           </div>
//         </>

//         // <div className="">
//         //   <div className="block md:hidden" onClick={() => setToggleMenu(true)}>
//         //     <MenuIcon />
//         //   </div>
//         //   <div className="hidden md:block">
//         //     <div className="flex gap-4 pr-5">
//         //       <MaterialButton
//         //         variant="outlined"
//         //         style={{ color: "black", borderColor: "black" }}
//         //         onClick={() => navigate("/login")}
//         //       >
//         //         Log In
//         //       </MaterialButton>
//         //       <MaterialButton
//         //         variant="outlined"
//         //         style={{ backgroundColor: "#8c52ff", color: "white" }}
//         //         onClick={() => navigate("/join-as-pro")}
//         //       >
//         //         Join as interior designer
//         //       </MaterialButton>
//         //     </div>
//         //   </div>
//         // </div>
//       )}
//       <Dialog
//         open={open}
//         onClose={() => handleClose}
//         sx={{ margin: "auto" }}
//         fullScreen={isFullScreen}
//       >
//         <DialogContent sx={{ height: "max-content", position: "relative" }}>
//           <IconButton
//             aria-label="close"
//             onClick={handleClose}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             x
//           </IconButton>
//           <JoinAsPro handleClose={handleClose} />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Navbar;

import { useState, useContext, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Login";
import axios from "axios";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Dialog,
  DialogContent,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
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
  const [toggleMenu, setToggleMenu] = useState(false);
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
      <div className="flex items-center gap-2 md:gap-4">
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
                style={{
                  borderColor: "#8c52ff",
                  color: "#8c52ff",
                  padding: "5px",
                }}
                onClick={() => navigate("/join-as-pro")}
              >
                Join as Pro
              </MaterialButton>
            </div>
          )}
          <div className={`p-[6px] mr-2 `}>
            <div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  if (isFullScreen) {
                    navigate("/profile-options");
                  } else {
                    setToggleProfileMenu(
                      (toggleProfileMenu) => !toggleProfileMenu
                    );
                    setIsDivVisible(true);
                  }
                }}
              >
                <Avatar sx={{ bgcolor: grey[400] }}>
                  {`${userDetails?.first_name[0]}${userDetails?.last_name[0]}`}
                </Avatar>
              </div>
            </div>
            <div
              className={
                toggleProfileMenu && isDivVisible
                  ? "fixed bg-[#f3f1f1] w-screen h-screen sm:h-auto sm:w-[400px] text-text right-1 flex flex-col items-center sm:justify-center top-[76px] sm:rounded-[10px] "
                  : "hidden"
              }
              style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
              ref={divRef}
            >
              <p className="mt-16 sm:mt-3">{userDetails?.email}</p>
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
                        className="text-text p-1 rounded-[8px] flex items-center gap-2 w-[95vw] sm:w-[350px] hover:bg-[#f3f1f1] transition-all"
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
        // <>
        //   <div className="md:flex hidden  gap-4 pr-5">
        //     <div className="hidden md:block">
        //       <MaterialButton
        //         variant="outlined"
        //         style={{ color: "black", borderColor: "black" }}
        //         onClick={() => navigate("/login")}
        //       >
        //         Log In
        //       </MaterialButton>
        //     </div>
        //     <div>
        //       <MaterialButton
        //         variant="outlined"
        //         style={{ backgroundColor: "#8c52ff", color: "white" }}
        //         onClick={() => navigate("/join-as-pro")}
        //       >
        //         Join as interior designer
        //       </MaterialButton>
        //     </div>
        //   </div>
        // </>

        <div className="">
          <div
            className="block md:hidden transition-all"
            onClick={() => setToggleMenu((prev) => !prev)}
          >
            {toggleMenu ? <CloseIcon /> : <MenuIcon />}
          </div>

          <div
            className={`${
              toggleMenu ? "block" : "hidden"
            } absolute right-0 top-14 h-screen w-screen bg-[#ffffff94] transition-all flex justify-end`}
          >
            <div className="w-fit bg-white p-2 h-screen mr-0">
              <div className="flex flex-col justify-center items-center gap-4">
                <MaterialButton
                  variant="outlined"
                  style={{
                    color: "black",
                    borderColor: "black",
                    width: "max-content",
                  }}
                  onClick={() => {
                    navigate("/login");
                    setToggleMenu(false);
                  }}
                >
                  Log In
                </MaterialButton>
                <MaterialButton
                  variant="outlined"
                  style={{ backgroundColor: "#8c52ff", color: "white" }}
                  onClick={() => {
                    navigate("/join-as-pro");
                    setToggleMenu(false);
                  }}
                >
                  Join as interior designer
                </MaterialButton>
              </div>
            </div>
          </div>
          <div className="hidden md:block ">
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
                onClick={() => navigate("/join-as-pro")}
              >
                Join as interior designer
              </MaterialButton>
            </div>
          </div>
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
