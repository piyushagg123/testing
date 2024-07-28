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
      <div className="flex gap-5 justify-between pr-2 xl:pr-4 text-[15px]">
        <p className="font-bold " onClick={() => setFilterMenu(() => true)}>
          FILTERS
        </p>

        <p className="hidden lg:block font-bold text-red">
          <button className="text-xs">CLEAR ALL</button>
        </p>
      </div>
      <div className="hidden lg:flex flex-col gap-0  h-screen">
        <div className="flex flex-col gap-1 pt-3">
          <text className="font-bold text-base text-darkgrey">THEMES</text>
          {formattedThemes.map((item) => {
            return (
              <FormControlLabel className="-mb-2.5 -mt-2.5"
                control={<Checkbox
                  sx={{
                    '&.Mui-checked': {
                      color: '#ff5757',
                    },
                    transform: 'scale(0.75)',
                  }}
                  onChange={(event: any) => handleThemeFilter(item)} />
                }
                label={<span className="text-sm">{item}</span>
                }
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-1 pt-5">
          <text className="font-bold text-base text-darkgrey">SPACES</text>
          {formattedSpaces.map((item) => {
            return (
              <FormControlLabel className="-mb-2.5 -mt-2.5"
                control={<Checkbox
                  sx={{
                    '&.Mui-checked': {
                      color: '#ff5757',
                    },
                    transform: 'scale(0.75)',
                  }}
                  onChange={(event: any) => handleSpaceFilter(item)} />
                }
                label={<span className="text-sm">{item}</span>
                }
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-1 pt-5">
          <text className="font-bold text-base text-darkgrey">EXECUTION TYPE</text>
          {formattedExecution.map((item) => {
            return (
              <FormControlLabel className="-mb-2.5 -mt-2.5"
                control={<Checkbox
                  sx={{
                    '&.Mui-checked': {
                      color: '#ff5757',
                    },
                    transform: 'scale(0.75)',
                  }}
                  onChange={(event: any) => handleExecutionFilter(item)} />
                }
                label={<span className="text-sm">{item}</span>
                }
              />
            );
          })}

        </div>

      </div>
    </div>
  );
};

export default Filters;
