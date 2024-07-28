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
import { Button } from "@mui/material";

const SearchProfessionals = () => {
  const [sortBy, setSortBy] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useContext(StateContext);

  const [themeFilters, setThemeFilters] = useState(new Set());
  const [spaceFilters, setSpaceFilters] = useState(new Set());
  const [executionFilters, setExecutionFilters] = useState(new Set());

  useEffect(() => {
    fetchVendorList(themeFilters, spaceFilters, executionFilters);
  }, [themeFilters, spaceFilters, executionFilters]);

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
    themeFilters = new Set(),
    spaceFilters = new Set(),
    executionFilters = new Set()
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.apiBaseUrl}/vendor/list`, {
        params: {
          category: "INTERIOR_DESIGNER",
          sub_category_1: Array.from(themeFilters).map(option => option.toUpperCase()).join(","),
          sub_category_2: Array.from(spaceFilters).map(option => option.toUpperCase()).join(","),
          sub_category_3: Array.from(executionFilters).map(option => option.toUpperCase()).join(","),
        },
      });
      setFilteredItems(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onThemeFiltersUpdate = (updatedItem) => {
    updatedItem = updatedItem.replace(/\s+/g, '_');
    let updatedThemeFilters = new Set(themeFilters);
    if (updatedThemeFilters.has(updatedItem)) {
      updatedThemeFilters.delete(updatedItem);
    } else {
      updatedThemeFilters.add(updatedItem);
    }
    setThemeFilters(updatedThemeFilters);
  };

  const onSpaceFiltersUpdate = (updatedItem) => {
    updatedItem = updatedItem.replace(/\s+/g, '_');
    let updatedSpaceFilters = new Set(spaceFilters);
    if (updatedSpaceFilters.has(updatedItem)) {
      updatedSpaceFilters.delete(updatedItem);
    } else {
      updatedSpaceFilters.add(updatedItem);
    }
    setSpaceFilters(updatedSpaceFilters);
  };

  const onExecutionFiltersUpdate = (updatedItem) => {
    updatedItem = updatedItem.replace(/\s+/g, '_');
    let updatedExecutionFilters = new Set(executionFilters);
    if (updatedExecutionFilters.has(updatedItem)) {
      updatedExecutionFilters.delete(updatedItem);
    } else {
      updatedExecutionFilters.add(updatedItem);
    }
    setExecutionFilters(updatedExecutionFilters);
  };

  return (
    <div className="mt-16"  >
      <div className="flex flex-col">
        <div className="bg-[#f0f0f0] text-prim w-[100%] m-auto flex flex-col items-center p-10">
          <h1 className="font-bold text-lg" style={{ color: '#576375' }}>
            FIND THE MOST SUITABLE INTERIOR DESIGNER NEAR YOU
          </h1>
          <p className="text-black">
            Answer a few questions and we will put you in touch with pros who
            can help.
          </p>
          <br />
          <br />
          <div className="flex flex-col md:flex-row gap-2 items-end bg-[#f0f0f0]">
            <label htmlFor="" className="text-black">
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
            <label htmlFor="" className="text-black">
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
            <Button
              variant="outlined"
              style={{ backgroundColor: "#8c52ff", color: "white" }}
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
      <br />
      <div className="flex  justify-start flex-col lg:flex-row items-start" style={{ paddingLeft: '64px', paddingRight: '64px' }}>
        <div className="w-fit" style={{ borderRight: "solid 0.5px #e3e3e3" }}>
          <div className="flex flex-wrap justify-center gap-2 lg:block">
            <Filters
              handleThemeFilter={onThemeFiltersUpdate}
              handleSpaceFilter={onSpaceFiltersUpdate}
              handleExecutionFilter={onExecutionFiltersUpdate}
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
