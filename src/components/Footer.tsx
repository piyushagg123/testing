import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Divider } from "@mui/material";
import Logo from "../assets/PickeleLogo.png";
import { NavLink } from "react-router-dom";
import constants from "../constants";

const Footer = () => {
  return (
    <div className=" bg-[#0D1216] text-white bottom-0">
      <div className=" mt-5  flex justify-between p-16">
        <div>
          <img src={Logo} alt="" width={150} />
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-[18px]">Company</p>
            <ScrollToTopNavLink to="/">Home</ScrollToTopNavLink>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-[18px]">Reach Us</p>
            <p>{constants.email}</p>
            <p>
              <FacebookIcon /> <InstagramIcon />
            </p>
          </div>
        </div>
      </div>
      <Divider sx={{ background: "white" }} />
      <p className="text-center text-sm">
        &#169; 2024 Pickele. All rights reserved
      </p>
      <br />
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
