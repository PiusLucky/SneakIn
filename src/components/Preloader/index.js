import React from "react";
import logo from "../../static/img/logo_no_gradient.svg";

const Preloader = () => {
  return (
    <div className="preloader">
    <div className="preloader__inner">
      <div  className="preloader__div">
         <img src={logo} alt="" className="preloader__logo" />
       </div>
       

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="200px"
        height="200px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle cx="84" cy="50" r="10" fill="#ffffff">
          <animate
            attributeName="r"
            repeatCount="indefinite"
            dur="0.5319148936170213s"
            calcMode="spline"
            keyTimes="0;1"
            values="10;0"
            keySplines="0 0.5 0.5 1"
            begin="0s"
          ></animate>
          <animate
            attributeName="fill"
            repeatCount="indefinite"
            dur="2.127659574468085s"
            calcMode="discrete"
            keyTimes="0;0.25;0.5;0.75;1"
            values="#ffffff;#ffffff;#ffffff;#ffffff;#ffffff"
            begin="0s"
          ></animate>
        </circle>
        <circle cx="16" cy="50" r="10" fill="#ffffff">
          <animate
            attributeName="r"
            repeatCount="indefinite"
            dur="2.127659574468085s"
            calcMode="spline"
            keyTimes="0;0.25;0.5;0.75;1"
            values="0;0;10;10;10"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
            begin="0s"
          ></animate>
          <animate
            attributeName="cx"
            repeatCount="indefinite"
            dur="2.127659574468085s"
            calcMode="spline"
            keyTimes="0;0.25;0.5;0.75;1"
            values="16;16;16;50;84"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
            begin="0s"
          ></animate>
        </circle>
        <circle cx="50" cy="50" r="10" fill="#ffffff">
          <animate
            attributeName="r"
            repeatCount="indefinite"
            dur="2.127659574468085s"
            calcMode="spline"
            keyTimes="0;0.25;0.5;0.75;1"
            values="0;0;10;10;10"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
            begin="-0.5319148936170213s"
          ></animate>
          <animate
            attributeName="cx"
            repeatCount="indefinite"
            dur="2.127659574468085s"
            calcMode="spline"
            keyTimes="0;0.25;0.5;0.75;1"
            values="16;16;16;50;84"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
            begin="-0.5319148936170213s"
          ></animate>
        </circle>
        <circle cx="84" cy="50" r="10" fill="#ffffff">
          <animate
            attributeName="r"
            repeatCount="indefinite"
            dur="2.127659574468085s"
            calcMode="spline"
            keyTimes="0;0.25;0.5;0.75;1"
            values="0;0;10;10;10"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
            begin="-1.0638297872340425s"
          ></animate>
          <animate
            attributeName="cx"
            repeatCount="indefinite"
            dur="2.127659574468085s"
            calcMode="spline"
            keyTimes="0;0.25;0.5;0.75;1"
            values="16;16;16;50;84"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
            begin="-1.0638297872340425s"
          ></animate>
        </circle>
        <circle cx="16" cy="50" r="10" fill="#ffffff">
          <animate
            attributeName="r"
            repeatCount="indefinite"
            dur="2.127659574468085s"
            calcMode="spline"
            keyTimes="0;0.25;0.5;0.75;1"
            values="0;0;10;10;10"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
            begin="-1.5957446808510638s"
          ></animate>
          <animate
            attributeName="cx"
            repeatCount="indefinite"
            dur="2.127659574468085s"
            calcMode="spline"
            keyTimes="0;0.25;0.5;0.75;1"
            values="16;16;16;50;84"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
            begin="-1.5957446808510638s"
          ></animate>
        </circle>
      </svg>
    </div>
</div>
)
}


export default Preloader;

