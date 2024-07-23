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
import config from "../config";
import { StateContext } from "../context/State";

const SearchProfessionals = () => {
  const [sortBy, setSortBy] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useContext(StateContext);

  const [filter1, setFilter1] = useState("");
  const [filter2, setFilter2] = useState("");
  const [filter3, setFilter3] = useState("");

  useEffect(() => {
    fetchVendorList(filter1, filter2, filter3);
  }, [filter1, filter2, filter3]);

  const handleStateChange = async (event, value) => {
    setSelectedState(value);
    setSelectedCity(null);

    if (value) {
      setLoadingCities(true);
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/location/cities?state=${value}`
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
      const response = await axios.get(`${config.apiBaseUrl}/vendor/list`, {
        params: {
          category: "INTERIOR_DESIGNER",
          sub_category_1: selectedOptions.toUpperCase(),
          sub_category_2: selectedOptions2.toUpperCase(),
          sub_category_3: selectedOptions3.toUpperCase(),
        },
      });
      setFilteredItems(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleThemeFilter = (selectedOptions) => {
    setFilter1(selectedOptions);
  };

  const handleSpaceFilter = (selectedOptions2) => {
    setFilter2(selectedOptions2);
  };

  const handleExecutionFilter = (selectedOptions3) => {
    setFilter3(selectedOptions3);
  };

  return (
    <div className="mt-16">
      <div className="flex flex-col">
        <div className="bg-[#2b3618] text-prim w-[100%] m-auto flex flex-col items-center p-10">
          <h1 className="text-2xl sm:text-3xl">
            Get matched with local professionals
          </h1>
          <p>
            Answer a few questions and we will put you in touch with pros who
            can help.
          </p>
          <br />
          <br />
          <div className="flex flex-col md:flex-row gap-2 items-end bg-[#2b3618]">
            <label htmlFor="">
              Select your state
              <Autocomplete
                size="small"
                disablePortal
                id="state-autocomplete"
                options={state}
                onChange={handleStateChange}
                sx={{
                  width: 225,
                  color: "white",
                  background: "white",
                  borderRadius: "4px",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // label="Enter your state"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </label>
            <label htmlFor="">
              Select your city
              <Autocomplete
                size="small"
                disablePortal
                id="city-autocomplete"
                options={selectedState ? cities : ["Select a state first"]}
                onChange={(event, value) => setSelectedCity(value)}
                loading={loadingCities}
                disabled={!selectedState}
                sx={{
                  width: 225,
                  color: "white",
                  background: "white",
                  borderRadius: "4px",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={!selectedState ? "Select a state first" : ""}
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
            </label>
            <button
              className="bg-white text-[#2b3618] border-[2px]  border-prim h-[40px] text-sm  p-2 hover:bg-prim hover:text-text "
              style={{ borderRadius: "5px" }}
            >
              Get started
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className="flex  justify-start flex-col lg:flex-row items-start">
        <div className="w-fit" style={{ borderRight: "solid 0.5px #e3e3e3" }}>
          <div className="flex flex-wrap justify-center gap-2 lg:block">
            <Filters
              handleThemeFilter={handleThemeFilter}
              handleSpaceFilter={handleSpaceFilter}
              handleExecutionFilter={handleExecutionFilter}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex mt-2 md:mt-0 gap-2 md:gap-0 flex-col-reverse md:justify-between md:pl-[0.75rem] pb-3 md:flex-row items-start md:items-start">
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
                      img={`${config.apiImageUrl}/${item.logo}`}
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
