import { useEffect, useState } from "react";
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

const fetchThemes = async (professional: string) => {
  if (professional === "interiorDesigners") {
    const response = await axios.get(
      `${constants.apiBaseUrl}/category/subcategory1/list?category=INTERIOR_DESIGNER`
    );
    return response.data.data.value;
  }
  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advisor/deals`
  );
  console.log(response);

  return response.data.data;
};

const fetchSpaces = async (professional: string) => {
  if (professional === "interiorDesigners") {
    const response = await axios.get(
      `${constants.apiBaseUrl}/category/subcategory2/list?category=INTERIOR_DESIGNER`
    );
    return response.data.data.value;
  }
  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advisor/investment-ideology`
  );
  console.log(response);

  return response.data.data;
};

const fetchExecutionTypes = async (professional: string) => {
  if (professional === "interiorDesigners") {
    const response = await axios.get(
      `${constants.apiBaseUrl}/category/subcategory3/list?category=INTERIOR_DESIGNER`
    );
    return response.data.data.value;
  }
  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advisor/fees-type`
  );
  console.log(response);

  return response.data.data;
};

interface FiltersProps {
  fetchVendorList: (
    themeFilters: any,
    spaceFilters: any,
    executionFilters: any
  ) => void;
  professional: string;
}

interface FilterItem {
  id: number;
  value: string;
}

const Filters: React.FC<FiltersProps> = ({ fetchVendorList, professional }) => {
  const { data: theme = [] } = useQuery(["themes", professional], () =>
    fetchThemes(professional)
  );
  const { data: spaces = [] } = useQuery(["spaces", professional], () =>
    fetchSpaces(professional)
  );
  const { data: executionType = [] } = useQuery(
    ["executionTypes", professional],
    () => fetchExecutionTypes(professional)
  );

  const [themeFilters, setThemeFilters] = useState(new Set());
  const [spaceFilters, setSpaceFilters] = useState(new Set());
  const [executionFilters, setExecutionFilters] = useState(new Set());

  useEffect(() => {
    fetchVendorList(themeFilters, spaceFilters, executionFilters);
  }, [themeFilters, spaceFilters, executionFilters]);

  const formatString = (str: string) => {
    const formattedStr = str?.toLowerCase().replace(/_/g, " ");
    return formattedStr?.charAt(0)?.toUpperCase() + formattedStr?.slice(1);
  };

  const formattedThemes = theme.map((theme: FilterItem | string) =>
    typeof theme === "object" && "value" in theme
      ? formatString(theme.value)
      : formatString(theme)
  );
  const formattedSpaces = spaces.map((space: FilterItem | string) =>
    typeof space === "object" && "value" in space
      ? formatString(space.value)
      : formatString(space)
  );

  const [filterMenu, setFilterMenu] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState(new Set<string>());
  const [selectedSpaces, setSelectedSpaces] = useState(new Set<string>());
  const [selectedExecutions, setSelectedExecutions] = useState(
    new Set<string>()
  );

  const handleCheckboxChange = (
    item: string,
    selectedItems: Set<any>,
    setSelectedItems: React.Dispatch<React.SetStateAction<Set<any>>>,
    setFilters: React.Dispatch<React.SetStateAction<Set<any>>>,
    filters: Set<any>
  ) => {
    const updatedItems = new Set(selectedItems);
    if (updatedItems.has(item)) {
      updatedItems.delete(item);
    } else {
      updatedItems.add(item);
    }
    setSelectedItems(updatedItems);
    handleFilterChange(item, filters, setFilters);
  };

  const handleFilterChange = (
    updatedItem: string,
    filters: Set<any>,
    setFilters: React.Dispatch<React.SetStateAction<Set<any>>>
  ) => {
    if (updatedItem === "") setFilters(new Set());
    else {
      updatedItem = updatedItem.replace(/\s+/g, "_");
      const updatedFilters = new Set(filters);
      if (updatedFilters.has(updatedItem)) {
        updatedFilters.delete(updatedItem);
      } else {
        updatedFilters.add(updatedItem);
      }
      setFilters(updatedFilters);
    }
  };

  const clearAll = () => {
    setSelectedThemes(new Set());
    setSelectedSpaces(new Set());
    setSelectedExecutions(new Set());
    handleFilterChange("", themeFilters, setThemeFilters);
    handleFilterChange("", spaceFilters, setSpaceFilters);
    handleFilterChange("", executionFilters, setExecutionFilters);
  };

  const showFilters = () => {
    return (
      <>
        <div className="flex flex-col gap-1 pt-3">
          <p className="font-bold text-base text-darkgrey">THEMES</p>
          {formattedThemes.map((theme: string) => {
            return (
              <>
                {console.log(formattedThemes)}
                <FormControlLabel
                  key={theme}
                  className="-mb-2.5 -mt-2.5"
                  control={
                    <Checkbox
                      checked={selectedThemes.has(theme)}
                      sx={{
                        "&.Mui-checked": {
                          color: "#ff5757",
                        },
                        transform: "scale(0.75)",
                      }}
                      onChange={() =>
                        handleCheckboxChange(
                          theme,
                          selectedThemes,
                          setSelectedThemes,
                          setThemeFilters,
                          themeFilters
                        )
                      }
                    />
                  }
                  label={<span className="text-sm">{theme}</span>}
                />
              </>
            );
          })}
        </div>
        <div className="flex flex-col gap-1 pt-5">
          <p className="font-bold text-base text-darkgrey">SPACES</p>
          {formattedSpaces.map((space: string) => {
            return (
              <FormControlLabel
                key={space}
                className="-mb-2.5 -mt-2.5"
                control={
                  <Checkbox
                    checked={selectedSpaces.has(space)}
                    sx={{
                      "&.Mui-checked": {
                        color: "#ff5757",
                      },
                      transform: "scale(0.75)",
                    }}
                    onChange={() =>
                      handleCheckboxChange(
                        space,
                        selectedSpaces,
                        setSelectedSpaces,
                        setSpaceFilters,
                        spaceFilters
                      )
                    }
                  />
                }
                label={<span className="text-sm">{space}</span>}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-7 pt-5">
          <p className="font-bold text-base text-darkgrey">EXECUTION TYPE</p>
          {executionType.map((executionType: FilterItem | string) => {
            const executionValue =
              typeof executionType === "object" && "value" in executionType
                ? executionType.value
                : executionType;

            const labelValue =
              typeof executionType === "object" && "value" in executionType
                ? executionValue === "DESIGN"
                  ? constants.DESIGN
                  : executionValue === "MATERIAL_SUPPORT"
                  ? constants.MATERIAL_SUPPORT
                  : executionValue === "COMPLETE"
                  ? constants.COMPLETE
                  : ""
                : executionValue;

            return (
              <FormControlLabel
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
                className="-mb-2.5 -mt-2.5"
                control={
                  <Checkbox
                    checked={selectedExecutions.has(executionValue)}
                    sx={{
                      "&.Mui-checked": {
                        color: "#ff5757",
                      },
                      transform: "scale(0.75)",
                      paddingY: 0,
                    }}
                    onChange={(_event: any) => {
                      handleCheckboxChange(
                        executionValue,
                        selectedExecutions,
                        setSelectedExecutions,
                        setExecutionFilters,
                        executionFilters
                      );
                    }}
                  />
                }
                label={<span className="text-sm">{labelValue}</span>}
              />
            );
          })}
        </div>
      </>
    );
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
                {showFilters()}
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={() => {
                      setFilterMenu(false);
                      window.scrollTo(0, 0);
                    }}
                    variant="outlined"
                    style={{ borderColor: "#8c52ff", color: "#8c52ff" }}
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
          <button className="text-xs" onClick={clearAll}>
            CLEAR ALL
          </button>
        </p>
      </div>
      <div className="hidden lg:flex flex-col gap-0  h-screen">
        {showFilters()}
      </div>
    </div>
  );
};

export default Filters;
