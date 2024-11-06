import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { useQuery } from "react-query";
import constants from "../../constants";
import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const fetchDeals = async () => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advisor/deals`
  );

  return response.data.data;
};

const fetchInvestmentIdeology = async () => {
  const response = await axios.get(
    `${constants.apiBaseUrl}/financial-advisor/investment-ideology`
  );

  return response.data.data;
};

interface FiltersProps {
  fetchVendorList: (dealFilters: any, investmentIdeologyFilters: any) => void;
}

interface FilterItem {
  id: number;
  value: string;
}

const FinancePlannerFilters: React.FC<FiltersProps> = ({ fetchVendorList }) => {
  const { data: filterCategory1 = [] } = useQuery(["deals"], () =>
    fetchDeals()
  );
  const { data: filterCategory2 = [] } = useQuery(["investmentIdeology"], () =>
    fetchInvestmentIdeology()
  );

  const [dealFilters, setDealFilters] = useState(new Set());
  const [investmentIdeologyFilters, setInvestmentIdeologyFilters] = useState(
    new Set()
  );

  useEffect(() => {
    fetchVendorList(dealFilters, investmentIdeologyFilters);
    window.scrollTo(0, 0);
  }, [dealFilters, investmentIdeologyFilters]);

  const formatString = (str: string) => {
    const formattedStr = str?.toLowerCase().replace(/_/g, " ");
    return formattedStr?.charAt(0)?.toUpperCase() + formattedStr?.slice(1);
  };

  const formattedDeals = filterCategory1.map((item: FilterItem) =>
    formatString(item.value)
  );
  const formattedInvestmentIdeology = filterCategory2.map((item: FilterItem) =>
    formatString(item.value)
  );

  const [filterMenu, setFilterMenu] = useState(false);
  const [selectedDeals, setSelectedDeals] = useState(new Set<string>());
  const [selectedInvestmentIdeologies, setSelectedInvestmentIdeologies] =
    useState(new Set<string>());

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
    setSelectedDeals(new Set());
    setSelectedInvestmentIdeologies(new Set());
    handleFilterChange("", dealFilters, setDealFilters);
    handleFilterChange(
      "",
      investmentIdeologyFilters,
      setInvestmentIdeologyFilters
    );
  };

  const showFilters = () => {
    return (
      <>
        <div className="flex flex-col gap-1 pt-3">
          <p className="font-bold text-base text-darkgrey">{"DEALS"}</p>
          {formattedDeals.map((deal: string) => {
            return (
              <>
                <FormControlLabel
                  key={deal}
                  className="-mb-2.5 -mt-2.5"
                  control={
                    <Checkbox
                      checked={selectedDeals.has(deal)}
                      sx={{
                        "&.Mui-checked": {
                          color: "#ff5757",
                        },
                        transform: "scale(0.75)",
                      }}
                      onChange={() =>
                        handleCheckboxChange(
                          deal,
                          selectedDeals,
                          setSelectedDeals,
                          setDealFilters,
                          dealFilters
                        )
                      }
                    />
                  }
                  label={<span className="text-sm">{deal}</span>}
                />
              </>
            );
          })}
        </div>
        <div className="flex flex-col gap-1 pt-5">
          <p className="font-bold text-base text-darkgrey">
            {"INVESTMENT IDEOLOGY"}
          </p>
          {formattedInvestmentIdeology.map((investmentIdeology: string) => {
            return (
              <FormControlLabel
                key={investmentIdeology}
                className="-mb-2.5 -mt-2.5"
                control={
                  <Checkbox
                    checked={selectedInvestmentIdeologies.has(
                      investmentIdeology
                    )}
                    sx={{
                      "&.Mui-checked": {
                        color: "#ff5757",
                      },
                      transform: "scale(0.75)",
                    }}
                    onChange={() =>
                      handleCheckboxChange(
                        investmentIdeology,
                        selectedInvestmentIdeologies,
                        setSelectedInvestmentIdeologies,
                        setInvestmentIdeologyFilters,
                        investmentIdeologyFilters
                      )
                    }
                  />
                }
                label={<span className="text-sm">{investmentIdeology}</span>}
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

export default FinancePlannerFilters;
