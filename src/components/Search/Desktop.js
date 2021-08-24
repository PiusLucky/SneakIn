import React from "react"
import { MdCancel } from "react-icons/md";
import { SearchInput } from "../Themefy/CustomTheme";

const Search = ({goNormalDesktop, handleSearchChange, searchLoading}) => {
 return (
  <div className="search_nav_desktop">
    <div className="search--icon">
      <MdCancel
        className="searchBack"
        onClick={goNormalDesktop}
      />
    </div>
    <div className="search--input">
      <SearchInput
        type="text"
        autoFocus
        placeholder="Search..."
        className="search--inputItem"
        onChange={handleSearchChange}
        style={{fontSize:"0.9rem", color:"grey"}}
      />
      {searchLoading &&
      <div className="search_spinner">
        <div className="search_double-bounce1"></div>
        <div className="search_double-bounce2"></div>
      </div>
      }
    </div>
  </div>
 )
}


export {Search};

