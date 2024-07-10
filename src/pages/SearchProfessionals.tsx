import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {
  CircularProgress,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Professional from "../components/Professional";
import Filters from "../components/Filters";
import { AuthContext } from "../context/Login";

const SearchProfessionals = () => {
  const [sortBy, setSortBy] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [data, setData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filter1, setFilter1] = useState("");
  const [filter2, setFilter2] = useState("");
  const [filter3, setFilter3] = useState("");

  useEffect(() => {
    fetchVendorList(filter1, filter2, filter3);
  }, [filter1, filter2, filter3]);

  const fetchStateData = async () => {
    setLoadingStates(true);
    try {
      const response = await axios.get(
        "https://designmatch.ddns.net/location/states"
      );
      setStates(response.data.data);
    } catch (error) {
      console.error("Error fetching state data:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  useEffect(() => {
    fetchStateData();
  }, []);

  const handleStateChange = async (value) => {
    setSelectedState(value);
    setSelectedCity(null);

    if (value) {
      setLoadingCities(true);
      try {
        const response = await axios.get(
          `https://designmatch.ddns.net/location/cities?state=${value}`
        );
        setCities(response.data.data);
      } catch (error) {
        console.error("Error fetching city data:", error);
      } finally {
        setLoadingCities(false);
      }
    } else {
      setCities([]);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    applyFilters();
  };

  const fetchVendorList = async (
    selectedOptions = "",
    selectedOptions2 = "",
    selectedOptions3 = ""
  ) => {
    setIsLoading(true);
    try {
      let response = await axios.get(
        "https://designmatch.ddns.net/vendor/list",
        {
          params: {
            category: "INTERIOR_DESIGNER",
            sub_category_1: selectedOptions.toUpperCase(),
            sub_category_2: selectedOptions2.toUpperCase(),
            sub_category_3: selectedOptions3.toUpperCase(),
          },
        }
      );
      setData(response.data.data);
      setFilteredItems(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleFilterChange = (selectedOptions) => {
    setFilter1(selectedOptions);
  };

  const handleFilterChange2 = (selectedOptions2) => {
    setFilter2(selectedOptions2);
  };

  const handleFilterChange3 = (selectedOptions3) => {
    setFilter3(selectedOptions3);
  };

  return (
    <div className="mt-16">
      <div className="flex flex-col">
        <div className="bg-text text-prim w-[100%] m-auto flex flex-col items-center p-10">
          <h1 className="text-2xl sm:text-3xl">
            Get matched with local professionals
          </h1>
          <p>
            Answer a few questions and we will put you in touch with pros who
            can help.
          </p>
          <br />
          <br />
          <div className="flex flex-col md:flex-row gap-2 bg-white p-3">
            <Autocomplete
              size="small"
              disablePortal
              id="state-autocomplete"
              options={states}
              onChange={handleStateChange}
              loading={loadingStates}
              sx={{ width: 225, color: "white" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter your state"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingStates ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              id="city-autocomplete"
              options={selectedState ? cities : ["Select a state first"]}
              onChange={(event, value) => setSelectedCity(value)}
              loading={loadingCities}
              disabled={!selectedState} // Disable if no state is selected
              sx={{ width: 225, color: "white" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    !selectedState ? "Select a state first" : "Enter your city"
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingCities ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
            <button
              className="bg-text text-prim border-[2px]  border-prim h-[40px] text-sm  p-2 hover:bg-prim hover:text-text "
              style={{ borderRadius: "5px" }}
            >
              Get started
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className="flex  justify-start flex-col lg:flex-row">
        <div className="w-fit" style={{ borderRight: "solid 0.5px #e3e3e3" }}>
          <div className="flex flex-wrap justify-center gap-2 lg:block">
            <Filters
              handleFilterChange={handleFilterChange}
              handleFilterChange2={handleFilterChange2}
              handleFilterChange3={handleFilterChange3}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex mt-2 md:mt-0 gap-2 md:gap-0 flex-col-reverse md:justify-between md:pl-[0.75rem] pb-3 md:flex-row items-center md:items-start">
            {filteredItems ? (
              <p>{filteredItems.length} Home improvement pros</p>
            ) : (
              <p>No home improvement pros for this category</p>
            )}
            <div className="w-[270px] lg:mr-2">
              <FormControl
                className="w-[270px] px-[14px] py-[10px]"
                sx={{ height: "40px" }}
                size="small"
              >
                <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                <Select
                  className="bg-prim"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sortBy}
                  label="Sort By"
                  onChange={handleSortChange}
                >
                  <MenuItem value={"rating"}>Rating</MenuItem>
                  <MenuItem value={"recommended"}>Recommended</MenuItem>
                  <MenuItem value={"popular"}>Popular</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {isLoading ? (
            ""
          ) : (
            <>
              {filteredItems?.map((item, ind) => (
                <NavLink
                  to={`/search-professionals/${item.vendor_id}`}
                  key={ind}
                >
                  <div>
                    <Professional
                      about={item.description}
                      rating={item.rating}
                      img={`https://designmatch-s3-bucket.s3.ap-south-1.amazonaws.com/${item.logo}`}
                      profCat={item.business_name}
                    />
                    <hr />
                    <br />
                  </div>
                </NavLink>
              ))}
            </>
          )}
          <br />
        </div>
      </div>
    </div>
  );
};

export default SearchProfessionals;
