import { useState } from "react";
import { FilterIcon, ReturnIcon, SearchIcon } from "../../../svg";
import axios from "axios";
import { useSelector } from "react-redux";

function Searchbar({ searchLength, setSearchResults }) {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [show, setShow] = useState(false);
  const handleSearch = async (e) => {
    if (e.target.value && e.key === "Enter") {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_AUTH_ENDPOINT}/user/?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults(data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };
  return (
    <div className="h-[49px] py-1.5">
      {/* Container */}
      <div className="px-[10px]">
        {/* Search input Conatiner */}
        <div className="flex items-center gap-x-2">
          <div className="w-full flex dark:bg-dark_bg_2 rounded-lg pl-2 items-center">
            {show || searchLength > 0 ? (
              <span
                className="w-8 flex items-center justify-center rotateAnimation cursor-pointer"
                onClick={() => setSearchResults([])}
              >
                <ReturnIcon className="fill-green_1 w-5" />
              </span>
            ) : (
              <span className="w-8 flex items-center justify-center">
                <SearchIcon className="dark:fill-dark_svg_2 w-5" />
              </span>
            )}
            <input
              type="text"
              placeholder="Search"
              className="input"
              onFocus={() => setShow(true)}
              onBlur={() => searchLength === 0 && setShow(false)}
              onKeyDown={(e) => handleSearch(e)}
            />{" "}
            {/* Set blur when click outside when onFocus-- when input box is active  // onKeyDown- ie when we add any input into the input box*/}
          </div>
          <button className="btn">
            <FilterIcon className="dark:fill-dark_svg_2" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Searchbar;
