import React, { useState, useContext, useEffect } from "react";
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
  Divider,
} from "@mui/material";
import {
  Professional,
  InteriorDesignerFilters,
  FinancePlannerFilters,
} from "../components";
import constants from "../constants";
import { StateContext } from "../context/State";
import service from "../assets/service.png";
import { ApiContext } from "../context/Api";

interface VendorItem {
  vendor_id?: string;
  financial_advisor_id?: string;
  description: string;
  rating: number;
  logo: string;
  business_name: string;
}

interface SearchProfessionalsProps {
  professional: string;
}

const SearchProfessionals: React.FC<SearchProfessionalsProps> = ({
  professional,
}) => {
  const apiContext = useContext(ApiContext);
  if (apiContext === undefined) {
    throw new Error("ApiContext must be used within a ApiProvider");
  }
  const { errorInApi, setErrorInApi } = apiContext;
  const stateContext = useContext(StateContext);
  if (stateContext === undefined) {
    throw new Error("StateContext must be used within a StateProvider");
  }

  const { state } = stateContext;
  const [cities, setCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<VendorItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const fetchInteriorDesignerList = async (
    themeFilters = new Set(),
    spaceFilters = new Set(),
    executionFilters = new Set()
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${constants.apiBaseUrl}/vendor/list`, {
        params: {
          category: "INTERIOR_DESIGNER",
          sub_category_1: Array.from(themeFilters as Set<string>)
            .map((option) => option.toUpperCase())
            .join(","),
          sub_category_2: Array.from(spaceFilters as Set<string>)
            .map((option) => option.toUpperCase())
            .join(","),
          sub_category_3: Array.from(executionFilters as Set<string>)
            .map((option) => option.toUpperCase())
            .join(","),
        },
      });
      setFilteredItems(response.data.data);
    } catch (error) {
      setErrorInApi(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFinanceAdvisorsList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${constants.apiBaseUrl}/financial-advisor/advisors`
      );
      setFilteredItems(response.data.data);
    } catch (error) {
      setErrorInApi(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (errorInApi) {
    return (
      <div className="maintenance-container flex flex-col justify-center items-center">
        <img
          src={service}
          alt=""
          className="w-[30vw]"
          style={{ mixBlendMode: "multiply" }}
        />
        <p>We are currently undergoing maintenance. Please check back later.</p>
      </div>
    );
  }
  return (
    <>
      <div className="mt-16">
        <div className="flex flex-col">
          <div className="bg-[#f0f0f0] w-[100%] m-auto flex flex-col items-center p-10">
            <h1 className="font-bold text-lg text-black">
              FIND THE MOST SUITABLE
              <span>
                {professional === "interiorDesigners"
                  ? " INTERIOR DESIGNER "
                  : " FINANCE PLANNER "}
              </span>
              NEAR YOU
            </h1>
            <p className="text-black text-m pt-2 pb-6">
              Answer a few questions to get a list of Interior Designers
              suitable for your needs
            </p>
            <div className="flex flex-col md:flex-row gap-2 items-center md:items-end">
              <label htmlFor="" className="text-black text-sm">
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
              <label htmlFor="" className="text-black text-sm">
                Select your city
                <Autocomplete
                  size="small"
                  disablePortal
                  id="city-autocomplete"
                  options={selectedState ? cities : ["Select a state first"]}
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
                style={{
                  backgroundColor: "#8c52ff",
                  color: "white",
                  height: "40px",
                }}
              >
                Get started
              </Button>
            </div>
          </div>
        </div>
        <div className="flex  justify-start flex-col lg:flex-row items-start p-1 lg:px-[64px] mt-[1em]">
          <div className="w-fit" style={{ borderRight: "solid 0.2px #e3e3e3" }}>
            <div className="flex flex-wrap justify-center gap-2 lg:block">
              {professional === "interiorDesigners" ? (
                <InteriorDesignerFilters
                  fetchVendorList={fetchInteriorDesignerList}
                />
              ) : (
                <FinancePlannerFilters
                  fetchVendorList={fetchFinanceAdvisorsList}
                />
              )}
            </div>
          </div>
          <div className="w-full">
            <div className="flex mt-2 md:mt-0 gap-1 md:gap-0 flex-col-reverse md:justify-between md:pl-[0.75rem] pb-3 md:flex-row items-start md:items-start">
              {filteredItems ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className="font-bold text-base text-black pl-3 md:pl-0">
                    {professional === "interiorDesigners"
                      ? "INTERIOR DESIGNERS"
                      : "FINANCE PLANNERS"}
                  </span>
                  <span
                    style={{
                      margin: "0 8px",
                      fontSize: "24px",
                      lineHeight: "1",
                    }}
                  >
                    •
                  </span>
                  <span className="text-sm text-black">
                    {filteredItems.length} found
                  </span>
                </div>
              ) : (
                <p>No home improvement pros for this category</p>
              )}
              <div className="w-[270px] lg:mr-2 hidden lg:block">
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
                    label="Sort By"
                  >
                    <MenuItem value={"rating"}>Rating</MenuItem>
                    <MenuItem value={"recommended"}>Recommended</MenuItem>
                    <MenuItem value={"popular"}>Popular</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {filteredItems ? (
              <>
                {isLoading ? (
                  <div className="flex justify-center h-screen">
                    <CircularProgress color="inherit" />
                  </div>
                ) : (
                  <>
                    {filteredItems.map((item) => (
                      <>
                        <NavLink
                          to={
                            professional === "interiorDesigners"
                              ? `/interior-designers/${item.vendor_id}`
                              : `/finance-planners/${item.financial_advisor_id}`
                          }
                          key={item.vendor_id}
                        >
                          <div className="mb-[2em] mt-1">
                            <Professional
                              about={item.description}
                              rating={item.rating}
                              img={item.logo}
                              profCat={item.business_name}
                            />
                          </div>
                        </NavLink>
                        <Divider />
                      </>
                    ))}
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchProfessionals;
