import * as React from "react";
import { AuthContext } from "../context/Login";
import data from "../assets/data.json";
import { Link } from "react-router-dom";
import {
  Autocomplete,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import axios from "axios";
import constants from "../constants";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import { StateContext } from "../context/State";
import SearchIcon from "@mui/icons-material/Search";

const Banner = () => {
  const authContext = React.useContext(AuthContext);
  const stateContext = React.useContext(StateContext);
  if (stateContext === undefined || authContext === undefined) {
    throw new Error("StateContext must be used within a StateProvider");
  }

  const itemData = [
    {
      img: "https://images.unsplash.com/photo-1549388604-817d15aa0110",
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
      img: "https://images.unsplash.com/photo-1588436706487-9d55d73a39e3",
      title: "Blinds",
    },

    {
      img: "https://images.unsplash.com/photo-1530731141654-5993c3016c77",
      title: "Laptop",
    },
  ];

  const { state } = stateContext;

  const [cities, setCities] = React.useState<string[]>([]);
  const [selectedState, setSelectedState] = React.useState<string>("");
  const [loadingCities, setLoadingCities] = React.useState<boolean>(false);

  const handleStateChange = async (_event: any, value: string | null) => {
    setSelectedState(value ?? "");

    if (value) {
      setLoadingCities(true);
      try {
        const response = await axios.get(
          `${constants.apiBaseUrl}/location/cities?state=${value}`
        );
        setCities(response.data.data);
      } catch (error) {
      } finally {
        setLoadingCities(false);
      }
    } else {
      setCities([]);
    }
  };

  if (authContext === undefined) {
    return;
  }
  return (
    <div className="mt-16 min-h-screen flex md:pt-10">
      <div className="md:w-[50vw] md:pt-4">
        <p className="text-2xl md:text-4xl w-[70%] md:pl-7 font-semibold block">
          Pick professionals effectively
        </p>
        <div className=" md:border-[1px] md:border-[#80808073] md:w-[450px] md:ml-7 p-4 mt-5 rounded-md">
          <p className="pb-4 text-lg hidden md:block">
            What are you looking for?
          </p>
          <div className=" flex justify-center flex-wrap gap-6 ">
            {data.map((item, ind) => (
              <Link
                to={item.route}
                className=" relative pb-1 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[1px] after:bg-black after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-[60%] w-20 md:w-28"
                key={ind}
              >
                <div className="flex flex-col items-center p-1 rounded-md bg-[#80808014] w-20 md:w-28">
                  <img
                    src={item.image}
                    alt=""
                    className="h-[40px] md:h-[56px] "
                  />
                </div>
                <p className="text-[12px] text-center">{item.name}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className=" justify-start mt-10 w-[70%] ml-10 gap-5 hidden md:flex">
          <div className="flex items-center gap-3">
            <StarOutlineIcon sx={{ fontSize: "30px" }} />
            <div className="flex flex-col">
              <p>4.8</p>
              <p className="text-darkgrey">Service rating</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GroupsIcon sx={{ fontSize: "30px" }} />
            <div className="flex flex-col">
              <p>12M+</p>
              <p className="text-darkgrey">Customers globally</p>
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

export default Banner;