import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Divider } from "@mui/material";
const Footer = () => {
  return (
    <div className=" bg-[#0D1216] text-white bottom-0">
      <div className=" mt-5  flex justify-between p-16">
        <p className="font-bold text-[30px]">Pickele</p>
        <div className="flex gap-16">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-[18px]">Company</p>
            <p>Home</p>
            <p>Contact</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-[18px]">Reach Us</p>
            <p>abc@gmail.com</p>
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

export default Footer;
