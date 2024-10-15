import * as React from "react";
import { AuthContext } from "../context/Login";
import data from "../assets/professionals.json";
import { Link } from "react-router-dom";
import { ImageList, ImageListItem } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import { StateContext } from "../context/State";

const HomePage = () => {
  const authContext = React.useContext(AuthContext);
  const stateContext = React.useContext(StateContext);
  if (stateContext === undefined || authContext === undefined) {
    return;
  }

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const itemData = [
    {
      img: "https://www.whsuites.com/wp-content/uploads/2023/04/CRM-For-Financial-Advisors.jpg",
      title: "Bed",
    },
    {
      img: "https://images.unsplash.com/photo-1525097487452-6278ff080c31",
      title: "Books",
    },

    {
      img: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3",
      title: "Kitchen",
    },
    {
      img: "https://canadianbusinesscollege.com/wp-content/uploads/2021/03/Mar-12-healthcare-careers-1201x800.jpg",
      title: "Blinds",
    },
  ];

  if (authContext === undefined) {
    return;
  }
  return (
    <div className="mt-16 min-h-screen flex md:pt-10 px-5 lg:px-16">
      <div className="md:w-[50vw] md:pt-4 ">
        <p className="text-2xl md:text-4xl text-center md:text-left md:w-[70%]  pt-5 md:pt-0 font-semibold block">
          Pick professionals effectively
        </p>
        <div className=" md:border-[1px] md:border-[#80808073] w-fit  p-4 mt-5 rounded-md">
          <p className="pb-4 text-lg hidden md:block">
            What are you looking for ?
          </p>
          <div className=" flex justify-start flex-wrap gap-6 ">
            {data.map((item, ind) => (
              <Link
                to={item.route}
                className=" relative pb-1 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[1px] after:bg-black after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-[60%] w-20 md:w-28"
                key={ind}
              >
                <div className="flex flex-col items-center justify-center p-1 rounded-md bg-[#80808014] w-20 md:w-28 h-16">
                  <img src={item.image} alt="" className="h-[40px]  " />
                </div>
                <p className="text-[12px] text-center">{item.name}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className=" justify-start mt-10 w-[70%]  gap-5 hidden md:flex">
          <div className="flex items-center gap-3">
            <GroupsIcon sx={{ fontSize: "30px" }} />
            <div className="flex flex-col">
              <p>100+</p>
              <p className="text-darkgrey">Registered professionals</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[50vw] hidden md:block">
        <ImageList variant="masonry" cols={2} gap={8} sx={{ padding: 1 }}>
          {itemData.map((item) => (
            <ImageListItem key={item.img}>
              <img
                srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.img}?w=248&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </div>
  );
};

export default HomePage;
