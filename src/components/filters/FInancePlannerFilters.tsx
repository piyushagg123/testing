import { useEffect, useState } from "react";
import { useQuery } from "react-query";
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
  fetchDeals,
  fetchInvestmentIdeology,
} from "../../controllers/finance-planners/FilterController";

interface FiltersProps {
  fetchVendorList: (dealFilters: any, investmentIdeologyFilters: any) => void;
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

  const formattedDeals = filterCategory1.map((item: FilterItem) =>
    removeUnderscoresAndFirstLetterCapital(item.value)
  );
  const formattedInvestmentIdeology = filterCategory2.map((item: FilterItem) =>
    removeUnderscoresAndFirstLetterCapital(item.value)
  );

  const [filterMenu, setFilterMenu] = useState(false);
  const [selectedDeals, setSelectedDeals] = useState(new Set<string>());
  const [selectedInvestmentIdeologies, setSelectedInvestmentIdeologies] =
    useState(new Set<string>());

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
        <div className="flex flex-col pt-3 gap-1">
          <p className="font-bold text-base text-black">{"DEALS"}</p>
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
                  label={
                    <span className="text-sm">
                      {deal === "Complete Wealth Management"
                        ? "Wealth management"
                        : deal}
                    </span>
                  }
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

export default FinancePlannerFilters;
