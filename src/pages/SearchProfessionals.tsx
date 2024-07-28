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
  Button,
} from "@mui/material";
import Professional from "../components/Professional";
import Filters from "../components/Filters";
import config from "../config";
import { StateContext } from "../context/State";

interface VendorItem {
  vendor_id: string;
  description: string;
  rating: number;
  logo: string;
  business_name: string;
}

const SearchProfessionals: React.FC = () => {
  const stateContext = useContext(StateContext);
  if (stateContext === undefined) {
    throw new Error("StateContext must be used within a StateProvider");
  }

  const { state } = stateContext;
  const [sortBy, setSortBy] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<VendorItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [filter1, setFilter1] = useState<string>("");
  const [filter2, setFilter2] = useState<string>("");
  const [filter3, setFilter3] = useState<string>("");

  useEffect(() => {
    fetchVendorList(filter1, filter2, filter3);
  }, [filter1, filter2, filter3]);

  const handleStateChange = async (_event: any, value: string | null) => {
    setSelectedState(value ?? "");
    setSelectedCity("");

    if (value) {
      setLoadingCities(true);
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/location/cities?state=${value}`
        );
        setCities(response.data.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      } finally {
        setLoadingCities(false);
      }
    } else {
      setCities([]);
    }
  };

  const fetchVendorList = async (
    selectedOptions: string,
    selectedOptions2: string,
    selectedOptions3: string
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
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeFilter = (selectedOptions: string) => {
    setFilter1(selectedOptions);
  };

  const handleSpaceFilter = (selectedOptions2: string) => {
    setFilter2(selectedOptions2);
  };

  const handleExecutionFilter = (selectedOptions3: string) => {
    setFilter3(selectedOptions3);
  };

  return (
    <div className="mt-16">
      <div className="flex flex-col">
        <div className="bg-[#f0f0f0] text-prim w-[100%] m-auto flex flex-col items-center p-10">
          <h1 className="text-2xl sm:text-3xl text-black">
            Get matched with local professionals
          </h1>
          <p className="text-black">
            Answer a few questions and we will put you in touch with pros who
            can help.
          </p>
          <br />
          <br />
          <div className="flex flex-col md:flex-row gap-2 items-end bg-[#f0f0f0]">
            <label htmlFor="state-autocomplete" className="text-black">
              Select your state
              <Autocomplete
                size="small"
                disablePortal
                id="state-autocomplete"
                options={state}
                onChange={(_event, value) => handleStateChange(_event, value)}
                sx={{
                  width: 225,
                  color: "white",
                  background: "white",
                  borderRadius: "4px",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
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
            <label htmlFor="city-autocomplete" className="text-black">
              Select your city
              <Autocomplete
                size="small"
                disablePortal
                id="city-autocomplete"
                options={selectedState ? cities : ["Select a state first"]}
                onChange={(_, value) => setSelectedCity(value ?? "")}
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
      <div className="flex justify-start flex-col lg:flex-row items-start">
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
            {filteredItems.length > 0 ? (
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
                <InputLabel id="sort-by-label">Sort by</InputLabel>
                <Select
                  className="bg-prim"
                  labelId="sort-by-label"
                  id="sort-by-select"
                  value={sortBy}
                  label="Sort By"
                  // onChange={handleSortChange}
                >
                  <MenuItem value={"rating"}>Rating</MenuItem>
                  <MenuItem value={"recommended"}>Recommended</MenuItem>
                  <MenuItem value={"popular"}>Popular</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {isLoading ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              {filteredItems.map((item) => (
                <NavLink
                  to={`/search-professionals/${item.vendor_id}`}
                  key={item.vendor_id}
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
