import React from "react";
import BlackRock from "../Themefy/BlackRock";
import BlueCharcoal from "../Themefy/BlueCharcoal";


const NoStarred = () => {
  return (
    <>
      <BlueCharcoal className="status channel-status error-404-main">
        <BlackRock className="error-center">
          <BlueCharcoal className="error-center-text add_star_margin">
            <div className="loader loader--style8">
              <svg version="1.1" id="layer_1_error" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                 width="24px" height="30px" viewBox="0 0 24 30">
                <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                </rect>
              </svg>
            </div>
            <span className="error-404-main--text">No Stars yet. You can star any image or chat message(s) you sent or those received.</span>
          </BlueCharcoal>
        </BlackRock>
      </BlueCharcoal>
    </>
  );
};

export default NoStarred;
