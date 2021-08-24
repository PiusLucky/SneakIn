import React from "react"
import { BiArrowBack } from "react-icons/bi";

const Search = ({goNormal, handleSearchChange}) => {
    return (  
     <div className="add_status channel-nav search_nav">
       <div className="search--icon">
         <BiArrowBack
           className="searchBack"
           onClick={goNormal}
         />
       </div>
       <div className="search--input">
         <input
           type="text"
           autoFocus
           placeholder="Search..."
           className="search--inputItem"
           onChange={handleSearchChange}
         />
       </div>
     </div>

    )
}



export {Search}