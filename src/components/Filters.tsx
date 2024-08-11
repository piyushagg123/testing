import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { useQuery } from "react-query";
import config from "../config";
import { FormControlLabel } from "@mui/material";

const fetchThemes = async () => {
  const response = await axios.get(
    `${config.apiBaseUrl}/category/subcategory1/list?category=INTERIOR_DESIGNER`
  );
  return response.data.data.value;
};

const fetchSpaces = async () => {
  const response = await axios.get(
    `${config.apiBaseUrl}/category/subcategory2/list?category=INTERIOR_DESIGNER`
  );
  return response.data.data.value;
};

const fetchExecutionTypes = async () => {
  const response = await axios.get(
    `${config.apiBaseUrl}/category/subcategory3/list?category=INTERIOR_DESIGNER`
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
  const formattedExecution = executionType.map((item: FilterItem) =>
    formatString(item.value)
  );

  const [filterMenu, setFilterMenu] = useState(false);
  return (
    <div className=" flex flex-col gap-3  text-text w-[225px]">
      <div className="flex gap-5 justify-between pr-2 xl:pr-4 text-[15px]">
        <p
          className="font-bold text-base text-darkgrey"
          onClick={() => setFilterMenu(() => true)}
        >
          FILTERS
        </p>
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
                  <h3 className="font-bold text-[19px]">Spaces</h3>

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
                <div className="flex flex-col gap-2 p-3">
                  <h3 className="font-bold text-[19px]">Execution Type</h3>

                  {formattedExecution.map((item: string) => {
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
                            onChange={(_event: any) =>
                              handleExecutionFilter(item)
                            }
                          />
                        }
                        label={<span className="text-sm">{item}</span>}
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
        <div className="flex flex-col gap-1 pt-5">
          <p className="font-bold text-base text-darkgrey">EXECUTION TYPE</p>
          {formattedExecution.map((item: string) => {
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
                    onChange={(_event: any) => handleExecutionFilter(item)}
                  />
                }
                label={<span className="text-sm">{item}</span>}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filters;
