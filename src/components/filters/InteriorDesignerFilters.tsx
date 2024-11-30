import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import constants from "../../constants";
import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
} from "@mui/material";
import { FilterAlt, Close } from "@mui/icons-material";
import { removeUnderscoresAndFirstLetterCapital } from "../../helpers/StringHelpers";
import { handleCheckboxChange, handleFilterChange } from "./Controller";
import { FilterItem } from "./Types";
import {
  fetchExecutionTypes,
  fetchSpaces,
  fetchThemes,
} from "../../controllers/interior-designers/FilterController";

interface FiltersProps {
  fetchVendorList: (
    themeFilters: any,
    spaceFilters: any,
    executionFilters: any
  ) => void;
}

const InteriorDesignerFilters: React.FC<FiltersProps> = ({
  fetchVendorList,
}) => {
  const { data: themes = [] } = useQuery(["themes"], () => fetchThemes());
  const { data: spaces = [] } = useQuery(["spaces"], () => fetchSpaces());
  const { data: executionType = [] } = useQuery(["executionTypes"], () =>
    fetchExecutionTypes()
  );

  const [themeFilters, setThemeFilters] = useState(new Set());
  const [spaceFilters, setSpaceFilters] = useState(new Set());
  const [executionFilters, setExecutionFilters] = useState(new Set());

  useEffect(() => {
    fetchVendorList(themeFilters, spaceFilters, executionFilters);
    window.scrollTo(0, 0);
  }, [themeFilters, spaceFilters, executionFilters]);

  const formattedThemes = themes.map((theme: FilterItem) =>
    removeUnderscoresAndFirstLetterCapital(theme.value)
  );
  const formattedSpaces = spaces.map((space: FilterItem) =>
    removeUnderscoresAndFirstLetterCapital(space.value)
  );

  const [filterMenu, setFilterMenu] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState(new Set<string>());
  const [selectedSpaces, setSelectedSpaces] = useState(new Set<string>());
  const [selectedExecutions, setSelectedExecutions] = useState(
    new Set<string>()
  );

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
          <p className="font-bold text-base text-black">THEMES</p>
          {formattedThemes.map((theme: string) => {
            return (
              <>
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
          <p className="font-bold text-base text-black">SPACES</p>
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
          <p className="font-bold text-base text-black">EXECUTION TYPE</p>
          {executionType.map((executionType: FilterItem) => {
            const labelValue =
              executionType.value === "DESIGN"
                ? constants.DESIGN
                : executionType.value === "MATERIAL_SUPPORT"
                ? constants.MATERIAL_SUPPORT
                : executionType.value === "COMPLETE"
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
                    checked={selectedExecutions.has(executionType.value)}
                    sx={{
                      "&.Mui-checked": {
                        color: "#ff5757",
                      },

                      transform: "scale(0.75)",
                      paddingY: 0,
                    }}
                    onChange={(_event: any) => {
                      handleCheckboxChange(
                        executionType.value,
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
    <div className=" flex flex-col gap-3  text-black w-[225px]">
      <div className="flex gap-5 justify-between pr-2 xl:pr-4 text-[15px] w-[93vw] md:w-[97vw] lg:w-auto m-auto md:m-0">
        <div className="flex gap-5 justify-between items-center w-[93vw] md:w-[97vw] lg:w-auto m-auto lg:m-0   text-[15px]">
          <p
            className="font-bold text-base text-black"
            onClick={() => setFilterMenu(() => true)}
          >
            <FilterAlt />
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
                  <Close onClick={() => setFilterMenu(false)} />
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

export default InteriorDesignerFilters;
