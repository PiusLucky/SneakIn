import React from "react";




const Loader = () => {
  return (
    <>
      <div className="loader-container">
         <div className="loader-container--image">
            <div className="loader-container--text">
              <span className="loader-container--textItem">
                <div className="spinnerLoader">
                  <div className="double-bounce1Loader"></div>
                  <div className="double-bounce2Loader"></div>
                </div>
              </span>
            </div>
         </div>
      </div>
    </>
  );
}





export default Loader;

