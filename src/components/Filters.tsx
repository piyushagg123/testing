import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "./Checkbox";
import axios from "axios";
import { useQuery } from "react-query";

const fetchThemes = async () => {
  const response = await axios.get(
    `https://designmatch.ddns.net/category/subcategory1/list?category=INTERIOR_DESIGNER`
  );
  return response.data.data.value;
};

const fetchSpaces = async () => {
  const response = await axios.get(
    `https://designmatch.ddns.net/category/subcategory2/list?category=INTERIOR_DESIGNER`
  );
  return response.data.data.value;
};

const fetchExecutionTypes = async () => {
  const response = await axios.get(
    `https://designmatch.ddns.net/category/subcategory3/list?category=INTERIOR_DESIGNER`
  );
  return response.data.data.value;
};
const Filters = ({
  handleThemeFilter,
  handleSpaceFilter,
  handleExecutionFilter,
}) => {
  const { data: theme = [], isLoading: themeLoading } = useQuery(
    "themes",
    fetchThemes
  );
  const { data: spaces = [], isLoading: spacesLoading } = useQuery(
    "spaces",
    fetchSpaces
  );
  const { data: executionType = [], isLoading: executionLoading } = useQuery(
    "executionTypes",
    fetchExecutionTypes
  );

  const formatString = (str) => {
    const formattedStr = str.toLowerCase().replace(/_/g, " ");
    return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
  };

  const formattedThemes = theme.map((item) => formatString(item.value));
  const formattedSpaces = spaces.map((item) => formatString(item.value));
  const formattedExecution = executionType.map((item) =>
    formatString(item.value)
  );

  const [filterMenu, setFilterMenu] = useState(false);
  return (
    <div className=" flex flex-col gap-3  text-text w-[225px]">
      <div className="flex gap-5 justify-between pr-2 pl-2 xl:pr-4 xl:pl-4 text-[15px]">
        <p className="font-bold " onClick={() => setFilterMenu(() => true)}>
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

                  <Checkbox
                    options={formattedThemes}
                    onChange={handleThemeFilter}
                  />
                </div>

                <div className="flex flex-col gap-2 p-3">
                  <h3 className="font-bold text-[19px]">Spaces</h3>

                  <Checkbox
                    options={formattedSpaces}
                    onChange={handleSpaceFilter}
                  />
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <h3 className="font-bold text-[19px]">Execution Type</h3>

                  <Checkbox
                    options={formattedExecution}
                    onChange={handleExecutionFilter}
                  />
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
        <p className="hidden lg:block font-bold text-text">
          <button>CLEAR ALL</button>
        </p>
      </div>
      <div className="hidden lg:flex flex-col gap-3  h-screen">
        <div className="flex flex-col gap-2 p-3 ">
          <h3 className="font-bold text-[19px]">Themes</h3>

          <Checkbox options={formattedThemes} onChange={handleThemeFilter} />
        </div>

        <div className="flex flex-col gap-2 p-3">
          <h3 className="font-bold text-[19px]">Spaces</h3>

          <Checkbox options={formattedSpaces} onChange={handleSpaceFilter} />
        </div>
        <div className="flex flex-col gap-2 p-3">
          <h3 className="font-bold text-[19px]">Execution Type</h3>

          <Checkbox
            options={formattedExecution}
            onChange={handleExecutionFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
