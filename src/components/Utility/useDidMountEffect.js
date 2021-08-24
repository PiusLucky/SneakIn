import React, { useEffect, useRef } from "react";
// const useDidMountEffect = (func, deps) => {
//     const didMount = useRef(true);

//     useEffect(() => {
//         if (didMount.current) func(); 
//         else  didMount.current = false;
//     }, deps);
// }

// export default useDidMountEffect;


function useFirstRender() {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}

export default useFirstRender;

