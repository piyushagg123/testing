import { Facebook, Instagram } from "@mui/icons-material";
import { Divider } from "@mui/material";
import { PickeleLogo } from "../assets";
import { NavLink } from "react-router-dom";
import constants from "../constants";

const Footer = () => {
  return (
    <div className=" bg-[#0D1216] text-white bottom-0 pt-[2em]">
      <div className=" mt-5 gap-2  flex flex-col md:flex-row justify-start md:justify-between p-7 lg:p-16">
        <div>
          <img src={PickeleLogo} width={150} />
        </div>
        <div className="flex gap-6 sm:gap-16 flex-col sm:flex-row">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-[18px]">Company</p>
            <ScrollToTopNavLink to="/">Home</ScrollToTopNavLink>
            <ScrollToTopNavLink to="/about">About Us</ScrollToTopNavLink>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-[18px]">Reach Us</p>
            <p>{constants.email}</p>
            <p>
              <Facebook /> <Instagram />
            </p>
          </div>
        </div>
      </div>
      <Divider sx={{ background: "white" }} />
      <p className="text-center text-sm pb-[1em]">
        &#169; 2024 Pickele. All rights reserved
      </p>
    </div>
  );
};

function ScrollToTopNavLink(props: any) {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return <NavLink {...props} onClick={handleClick} />;
}

export default Footer;
