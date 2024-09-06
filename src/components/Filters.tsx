import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { useQuery } from "react-query";
import constants from "../constants";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const fetchThemes = async () => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/category/subcategory1/list?category=INTERIOR_DESIGNER`
  );
  return response.data.data.value;
};

const fetchSpaces = async () => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/category/subcategory2/list?category=INTERIOR_DESIGNER`
  );
  return response.data.data.value;
};

const fetchExecutionTypes = async () => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/category/subcategory3/list?category=INTERIOR_DESIGNER`
  );
  return response.data.data.value;
};

interface FiltersProps {
  fetchVendorList: (themes: any, space: any, execution: any) => void;
}

interface FilterItem {
  id: number;
  value: string;
}

const Filters: React.FC<FiltersProps> = ({ fetchVendorList }) => {
  const { data: theme = [] } = useQuery("themes", fetchThemes);
  const { data: spaces = [] } = useQuery("spaces", fetchSpaces);
  const { data: executionType = [] } = useQuery(
    "executionTypes",
    fetchExecutionTypes
  );

  const [themeFilters, setThemeFilters] = useState(new Set());
  const [spaceFilters, setSpaceFilters] = useState(new Set());
  const [executionFilters, setExecutionFilters] = useState(new Set());

  useEffect(() => {
    fetchVendorList(themeFilters, spaceFilters, executionFilters);
  }, [themeFilters, spaceFilters, executionFilters]);

  const handleThemeFilter = (updatedItem: string) => {
    if (updatedItem === "") setThemeFilters(new Set());
    else {
      updatedItem = updatedItem.replace(/\s+/g, "_");
      let updatedThemeFilters = new Set(themeFilters);
      if (updatedThemeFilters.has(updatedItem)) {
        updatedThemeFilters.delete(updatedItem);
      } else {
        updatedThemeFilters.add(updatedItem);
      }
      setThemeFilters(updatedThemeFilters);
    }
  };

  const handleSpaceFilter = (updatedItem: string) => {
    if (updatedItem === "") setSpaceFilters(new Set());
    else {
      updatedItem = updatedItem.replace(/\s+/g, "_");
      let updatedSpaceFilters = new Set(spaceFilters);
      if (updatedSpaceFilters.has(updatedItem)) {
        updatedSpaceFilters.delete(updatedItem);
      } else {
        updatedSpaceFilters.add(updatedItem);
      }
      setSpaceFilters(updatedSpaceFilters);
    }
  };

  const handleExecutionFilter = (updatedItem: string) => {
    if (updatedItem === "") setExecutionFilters(new Set());
    else {
      updatedItem = updatedItem.replace(/\s+/g, "_");
      let updatedExecutionFilters = new Set(executionFilters);
      if (updatedExecutionFilters.has(updatedItem)) {
        updatedExecutionFilters.delete(updatedItem);
      } else {
        updatedExecutionFilters.add(updatedItem);
      }
      setExecutionFilters(updatedExecutionFilters);
    }
  };
  const formatString = (str: string) => {
    const formattedStr = str.toLowerCase().replace(/_/g, " ");
    return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
  };

  const formattedThemes = theme.map((item: FilterItem) =>
    formatString(item.value)
  );
  const formattedSpaces = spaces.map((item: FilterItem) =>
    formatString(item.value)
  );

  const [filterMenu, setFilterMenu] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState(new Set<string>());
  const [selectedSpaces, setSelectedSpaces] = useState(new Set<string>());
  const [selectedExecutions, setSelectedExecutions] = useState(
    new Set<string>()
  );

  const handleThemeCheckboxChange = (item: string) => {
    const updatedThemes = new Set(selectedThemes);
    if (updatedThemes.has(item)) {
      updatedThemes.delete(item);
    } else {
      updatedThemes.add(item);
    }
    setSelectedThemes(updatedThemes);
    handleThemeFilter(item);
  };

  const handleSpaceCheckboxChange = (item: string) => {
    const updatedSpaces = new Set(selectedSpaces);
    if (updatedSpaces.has(item)) {
      updatedSpaces.delete(item);
    } else {
      updatedSpaces.add(item);
    }
    setSelectedSpaces(updatedSpaces);
    handleSpaceFilter(item);
  };

  const handleExecutionCheckboxChange = (item: string) => {
    const updatedExecutions = new Set(selectedExecutions);
    if (updatedExecutions.has(item)) {
      updatedExecutions.delete(item);
    } else {
      updatedExecutions.add(item);
    }
    setSelectedExecutions(updatedExecutions);
    handleExecutionFilter(item);
  };

  const clearAll = () => {
    setSelectedThemes(new Set());
    setSelectedSpaces(new Set());
    setSelectedExecutions(new Set());
    handleThemeFilter("");
    handleSpaceFilter("");
    handleExecutionFilter("");
  };

  return (
    <div className=" flex flex-col gap-3  text-text w-[225px]">
      <div className="flex gap-5 justify-between pr-2 xl:pr-4 text-[15px] w-[93vw] md:w-[97vw] lg:w-auto m-auto md:m-0">
        <div className="flex gap-5 justify-between items-center w-[93vw] md:w-[97vw] lg:w-auto m-auto lg:m-0   text-[15px]">
          <p
            className="font-bold text-base text-darkgrey"
            onClick={() => setFilterMenu(() => true)}
          >
            <FilterAltIcon />
          </p>

          <div className="lg:hidden">
            <FormControl
              className="w-[200px] py-[10px] left-[15px]"
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
        {filterMenu ? (
          <>
            <div
              className={"block absolute bg-white w-screen z-10 lg:hidden p-3"}
            >
              <div>
                <div className="flex items-center justify-between pr-4">
                  <h1 className="font-bold">FILTERS</h1>
                  <CloseIcon onClick={() => setFilterMenu(false)} />
                </div>
                <div className="flex flex-col gap-2 p-3 ">
                  <h3 className="font-bold text-[19px]">Themes</h3>

                  {formattedThemes.map((item: string) => {
                    return (
                      <FormControlLabel
                        key={item}
                        className="-mb-2.5 -mt-2.5"
                        control={
                          <Checkbox
                            checked={selectedThemes.has(item)}
                            sx={{
                              "&.Mui-checked": {
                                color: "#ff5757",
                              },
                              transform: "scale(0.75)",
                            }}
                            onChange={() => handleThemeCheckboxChange(item)}
                          />
                        }
                        label={<span className="text-sm">{item}</span>}
                      />
                    );
                  })}
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-[19px]">Spaces</h3>

                  {formattedSpaces.map((item: string) => {
                    return (
                      <FormControlLabel
                        key={item}
                        className="-mb-2.5 -mt-2.5"
                        control={
                          <Checkbox
                            checked={selectedSpaces.has(item)}
                            sx={{
                              "&.Mui-checked": {
                                color: "#ff5757",
                              },
                              transform: "scale(0.75)",
                            }}
                            onChange={() => handleSpaceCheckboxChange(item)}
                          />
                        }
                        label={<span className="text-sm">{item}</span>}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-col gap-7 pt-5">
                  <p className="font-bold text-base text-darkgrey">
                    EXECUTION TYPE
                  </p>
                  {executionType.map((item: FilterItem) => {
                    const labelValue =
                      item.value === "DESIGN"
                        ? constants.DESIGN
                        : item.value === "MATERIAL_SUPPORT"
                        ? constants.MATERIAL_SUPPORT
                        : item.value === "COMPLETE"
                        ? constants.COMPLETE
                        : "";
                    return (
                      <FormControlLabel
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                        className="-mb-2.5 -mt-2.5"
                        control={
                          <Checkbox
                            checked={selectedExecutions.has(item.value)}
                            sx={{
                              "&.Mui-checked": {
                                color: "#ff5757",
                              },

                              transform: "scale(0.75)",
                              paddingY: 0,
                            }}
                            onChange={(_event: any) => {
                              handleExecutionFilter(item.value);
                              handleExecutionCheckboxChange(item.value);
                            }}
                          />
                        }
                        label={<span className="text-sm">{labelValue}</span>}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setFilterMenu(false)}
                    className="bg-[green] text-white p-2 rounded-lg"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        <p className="hidden lg:block font-bold text-red">
          <button className="text-xs" onClick={clearAll}>
            CLEAR ALL
          </button>
        </p>
      </div>
      <div className="hidden lg:flex flex-col gap-0  h-screen">
        <div className="flex flex-col gap-1 pt-3">
          <p className="font-bold text-base text-darkgrey">THEMES</p>
          {formattedThemes.map((item: string) => {
            return (
              <FormControlLabel
                key={item}
                className="-mb-2.5 -mt-2.5"
                control={
                  <Checkbox
                    checked={selectedThemes.has(item)}
                    sx={{
                      "&.Mui-checked": {
                        color: "#ff5757",
                      },
                      transform: "scale(0.75)",
                    }}
                    onChange={() => handleThemeCheckboxChange(item)}
                  />
                }
                label={<span className="text-sm">{item}</span>}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-1 pt-5">
          <p className="font-bold text-base text-darkgrey">SPACES</p>
          {formattedSpaces.map((item: string) => {
            return (
              <FormControlLabel
                key={item}
                className="-mb-2.5 -mt-2.5"
                control={
                  <Checkbox
                    checked={selectedSpaces.has(item)}
                    sx={{
                      "&.Mui-checked": {
                        color: "#ff5757",
                      },
                      transform: "scale(0.75)",
                    }}
                    onChange={() => handleSpaceCheckboxChange(item)}
                  />
                }
                label={<span className="text-sm">{item}</span>}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-7 pt-5">
          <p className="font-bold text-base text-darkgrey">EXECUTION TYPE</p>
          {executionType.map((item: FilterItem) => {
            const labelValue =
              item.value === "DESIGN"
                ? constants.DESIGN
                : item.value === "MATERIAL_SUPPORT"
                ? constants.MATERIAL_SUPPORT
                : item.value === "COMPLETE"
                ? constants.COMPLETE
                : "";
            return (
              <FormControlLabel
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
                className="-mb-2.5 -mt-2.5"
                control={
                  <Checkbox
                    checked={selectedExecutions.has(item.value)}
                    sx={{
                      "&.Mui-checked": {
                        color: "#ff5757",
                      },

                      transform: "scale(0.75)",
                      paddingY: 0,
                    }}
                    onChange={(_event: any) => {
                      handleExecutionFilter(item.value);
                      handleExecutionCheckboxChange(item.value);
                    }}
                  />
                }
                label={<span className="text-sm">{labelValue}</span>}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filters;
