import React, {useEffect, forwardRef} from "react";
import Zoom from "react-reveal/Zoom";
import { BiArrowBack } from "react-icons/bi";
import { RiCloseFill } from "react-icons/ri";


const ProfileHamburgerModal = forwardRef((props, ref) => {
  const {
    goBack,
    removeHamModal
  } = props;

  useEffect(() => {
    const hamModal = ref.current;
    const handleWindowClick = (event) => {
      if (hamModal) {
        if (hamModal.contains(event.target)) {
          return;
        } else {
          if (event.target.className === "hamburger") {
            return;
          } else {
            goBack();
          }
        }
      }
    };

    if (hamModal) {
      window.addEventListener("click", handleWindowClick);
    } else {
      window.removeEventListener("click", handleWindowClick);
    }
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [ref, goBack]);


  return (
    <>
    <div ref={ref}>
      <Zoom right>
        <div className="hamModal" id="hamModalId">
          <span className="hamModal--back">
            <RiCloseFill className="hamModal--backItem" onClick={goBack} />
          </span>
          <hr className="hr ham_hr" />
          <div className="ham_mainContent">
          <div className="hamModalItem" onClick={removeHamModal}>
            <div className="hamModalItem1">
              <BiArrowBack className="hamModalItem1icon" />
            </div>
            <div>Go Back</div>
          </div>
          </div>
        </div>
      </Zoom>
    </div>
    </>
  );
});

export default ProfileHamburgerModal;
