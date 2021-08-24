import React, { forwardRef, useEffect } from "react";
import Zoom from "react-reveal/Zoom";
import { BiArrowBack, BiEditAlt } from "react-icons/bi";
import { CgMenuMotion } from "react-icons/cg";
import { RiCloseFill } from "react-icons/ri";

const ProfileHamburgerModal = forwardRef((props, ref) => {
  const {
    goBack,
    groupCheckSetter,
    dmCheckSetter,
    removeHamModal,
    showEditDiv,
    aboutCheckSetter
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
            <div className="hamModalItem" onClick={dmCheckSetter}>
              <div className="hamModalItem1">
                <CgMenuMotion className="hamModalItem1icon" />
              </div>
              <div>All Chats </div>
            </div>
            <div className="hamModalItem" onClick={groupCheckSetter}>
              <div className="hamModalItem1">
                <CgMenuMotion className="hamModalItem1icon" />
              </div>
              <div>All Channels </div>
            </div>
            {showEditDiv && (
              <div className="hamModalItem" onClick={() => aboutCheckSetter()}>
                <div className="hamModalItem1">
                  <BiEditAlt className="hamModalItem1icon" />
                </div>
                <div>Edit Profile Info</div>
              </div>
            )}
          </div>
        </div>
      </Zoom>
     </div>
    </>
  );
});

export default ProfileHamburgerModal;
