import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { useQuery } from "react-query";
import constants from "../constants";
import {
  Button,
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
  handleThemeFilter: (selected: string) => void;
  handleSpaceFilter: (selected: string) => void;
  handleExecutionFilter: (selected: string) => void;
}

interface FilterItem {
  id: number;
  value: string;
}
const Filters: React.FC<FiltersProps> = ({
  handleThemeFilter,
  handleSpaceFilter,
  handleExecutionFilter,
}) => {
  const { data: theme = [] } = useQuery("themes", fetchThemes);
  const { data: spaces = [] } = useQuery("spaces", fetchSpaces);
  const { data: executionType = [] } = useQuery(
    "executionTypes",
    fetchExecutionTypes
  );

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
                  <h3 className="font-bold text-base text-darkgrey">Themes</h3>

                  {formattedThemes.map((item: string) => {
                    return (
                      <FormControlLabel
                        className="-mb-2.5 -mt-2.5"
                        control={
                          <Checkbox
                            sx={{
                              "&.Mui-checked": {
                                color: "#ff5757",
                              },
                              transform: "scale(0.75)",
                            }}
                            onChange={(_event: any) => handleThemeFilter(item)}
                          />
                        }
                        label={<span className="text-sm">{item}</span>}
                      />
                    );
                  })}
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-base text-darkgrey">Spaces</h3>

                  {formattedSpaces.map((item: string) => {
                    return (
                      <FormControlLabel
                        className="-mb-2.5 -mt-2.5"
                        control={
                          <Checkbox
                            sx={{
                              "&.Mui-checked": {
                                color: "#ff5757",
                              },
                              transform: "scale(0.75)",
                            }}
                            onChange={(_event: any) => handleSpaceFilter(item)}
                          />
                        }
                        label={<span className="text-sm">{item}</span>}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-col pt-5 gap-4">
                  <p className="font-bold text-base text-darkgrey">
                    Execution type
                  </p>
                  <div className="flex flex-col gap-7">
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
                              sx={{
                                "&.Mui-checked": {
                                  color: "#ff5757",
                                },

                                transform: "scale(0.75)",
                                paddingY: 0,
                              }}
                              onChange={(_event: any) =>
                                handleExecutionFilter(item.value)
                              }
                            />
                          }
                          label={<span className="text-sm">{labelValue}</span>}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={() => setFilterMenu(false)}
                    variant="outlined"
                    style={{ backgroundColor: "#8c52ff", color: "white" }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        <p className="hidden lg:block font-bold text-red">
          <button className="text-xs">CLEAR ALL</button>
        </p>
      </div>
      <div className="hidden lg:flex flex-col gap-0  h-screen">
        <div className="flex flex-col gap-1 pt-3">
          <p className="font-bold text-base text-darkgrey">THEMES</p>
          {formattedThemes.map((item: string) => {
            return (
              <FormControlLabel
                className="-mb-2.5 -mt-2.5"
                control={
                  <Checkbox
                    sx={{
                      "&.Mui-checked": {
                        color: "#ff5757",
                      },
                      transform: "scale(0.75)",
                    }}
                    onChange={(_event: any) => handleThemeFilter(item)}
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
                className="-mb-2.5 -mt-2.5"
                control={
                  <Checkbox
                    sx={{
                      "&.Mui-checked": {
                        color: "#ff5757",
                      },
                      transform: "scale(0.75)",
                    }}
                    onChange={(_event: any) => handleSpaceFilter(item)}
                  />
                }
                label={<span className="text-sm">{item}</span>}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-4  pt-5">
          <p className="font-bold text-base text-darkgrey">EXECUTION TYPE</p>
          <div className="flex flex-col gap-7">
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
                      sx={{
                        "&.Mui-checked": {
                          color: "#ff5757",
                        },

                        transform: "scale(0.75)",
                        paddingY: 0,
                      }}
                      onChange={(_event: any) =>
                        handleExecutionFilter(item.value)
                      }
                    />
                  }
                  label={<span className="text-sm">{labelValue}</span>}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
