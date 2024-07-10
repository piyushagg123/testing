import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const MobileFilter = () => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div
      className={
        openMenu ? "block absolute bg-white w-screen md:hidden" : "hidden"
      }
    >
      <div>
        <div>
          <h1>FILTERS</h1>
          <IoMdCloseCircleOutline onClick={() => setOpenMenu(false)} />
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
          <h3 className="font-bold text-[19px]">Professional Category</h3>
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
      </div>
    </div>
  );
};

export default MobileFilter;
