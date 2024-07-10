import { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import Checkbox from "./Checkbox";
import axios from "axios";

const Filters = ({
  handleFilterChange,
  handleFilterChange2,
  handleFilterChange3,
}) => {
  const [profession, setProfession] = useState([]);
  const [theme, setTheme] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [executionType, setExecutionType] = useState([]);
  useEffect(() => {
    const fetchProfession = async () => {
      try {
        let response = await axios.get(
          `https://designmatch.ddns.net/category/list`
        );
        setProfession(response.data.data.value);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchTheme = async () => {
      try {
        let response = await axios.get(
          `https://designmatch.ddns.net/category/subcategory1/list?category=INTERIOR_DESIGNER`
        );
        setTheme(response.data.data.value);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchSpaces = async () => {
      try {
        let response = await axios.get(
          `https://designmatch.ddns.net/category/subcategory2/list?category=INTERIOR_DESIGNER`
        );
        setSpaces(response.data.data.value);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchExecution = async () => {
      try {
        let response = await axios.get(
          `https://designmatch.ddns.net/category/subcategory3/list?category=INTERIOR_DESIGNER`
        );
        setExecutionType(response.data.data.value);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProfession();
    fetchSpaces();
    fetchTheme();
    fetchExecution();
  }, []);

  const formatString = (str: String) => {
    return str
      .toLowerCase()
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const formattedThemes = theme.map((item) => formatString(item.value));
  const formattedSpaces = spaces.map((item) => formatString(item.value));
  const formattedExecution = executionType.map((item) =>
    formatString(item.value)
  );

  let [filterMenu, setFilterMenu] = useState(false);
  return (
    <div className=" flex flex-col gap-3  text-text w-[225px]">
      <div className="flex gap-5 justify-between pr-2 pl-2 xl:pr-4 xl:pl-4 text-[15px]">
        <p className="font-bold " onClick={() => setFilterMenu(() => true)}>
          FILTERS
        </p>
        {filterMenu ? (
          <>
            <div
              className={"block absolute bg-white w-screen z-10 md:hidden p-3"}
            >
              <div>
                <div className="flex items-center justify-between pr-4">
                  <h1>FILTERS</h1>
                  <IoMdCloseCircleOutline
                    onClick={() => setFilterMenu(false)}
                  />
                </div>
                <div className="flex flex-col gap-2 p-3 ">
                  <h3 className="font-bold text-[19px]">Location</h3>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          value=""
                          className="mr-3"
                        />
                        Delhi
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          value=""
                          className="mr-3"
                        />
                        Ghaziabad
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          value=""
                          className="mr-3"
                        />
                        Greater Noida
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          value=""
                          className="mr-3"
                        />
                        Gurugram
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          value=""
                          className="mr-3"
                        />
                        Noida
                      </label>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <h3 className="font-bold text-[19px]">
                    Professional Category
                  </h3>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          value=""
                          className="mr-3"
                        />
                        Architects and Building Designers
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          value=""
                          className="mr-3"
                        />
                        Home Builders
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          value=""
                          className="mr-3"
                        />
                        Interior Designers and Decorators
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          value=""
                          className="mr-3"
                        />
                        Civil Engineers and Contractors
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          value=""
                          className="mr-3"
                        />
                        Design-Build Firms
                      </label>
                    </li>
                  </ul>
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

          <Checkbox options={formattedThemes} onChange={handleFilterChange} />
        </div>

        <div className="flex flex-col gap-2 p-3">
          <h3 className="font-bold text-[19px]">Spaces</h3>

          <Checkbox options={formattedSpaces} onChange={handleFilterChange2} />
        </div>
        <div className="flex flex-col gap-2 p-3">
          <h3 className="font-bold text-[19px]">Execution Type</h3>

          <Checkbox
            options={formattedExecution}
            onChange={handleFilterChange3}
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
