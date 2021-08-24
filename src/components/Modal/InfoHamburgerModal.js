import React, { forwardRef, useEffect } from "react";
import Zoom from "react-reveal/Zoom";
import { BiArrowBack } from "react-icons/bi";
import { RiDeleteBin5Line, RiCloseFill } from "react-icons/ri";
import { CgMenuMotion } from "react-icons/cg";

const InfoHamburgerModal = forwardRef((props, ref) => {
  const {
    hamModalTracker,
    removeHamModal,
    ignoreChannel,
    removeGoGroupInfo,
    isPrivateChannel,
    showAYS
  } = props;

  useEffect(() => {
    const hamModal = ref.current;
    const handleWindowClick = (event) => {
      if (hamModalTracker && hamModal) {
        if (hamModal.contains(event.target)) {
          return;
        } else {
          if (event.target.className === "hamburger") {
            return;
          } else {
            removeHamModal();
          }
        }
      }
    };

    if (hamModal && hamModalTracker) {
      window.addEventListener("click", handleWindowClick);
    } else {
      window.removeEventListener("click", handleWindowClick);
    }
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [ref, hamModalTracker, removeHamModal]);


  return (
    <>
     <div ref={ref}>
      <Zoom right>
        <div className="hamModal" id="hamModalId">
         <span className="hamModal--back">
           <RiCloseFill
             className="hamModal--backItem"
             onClick={removeHamModal}
           />
         </span>
         <hr className="hr ham_hr" />
         <div className="ham_mainContent">
           <div className="hamModalItem" onClick={removeGoGroupInfo}>
             <div className="hamModalItem1">
               <BiArrowBack className="hamModalItem1icon" />
             </div>
             <div>Back to {isPrivateChannel ? "Chat" : "Group"}</div>
           </div>
           <div className="hamModalItem" onClick={ignoreChannel}>
             <div className="hamModalItem1">
               <CgMenuMotion className="hamModalItem1icon" />
             </div>
             <div>All {isPrivateChannel ? "Chats" : "Channels"}</div>
           </div>
           <>
           <div className="hamModalItem" onClick={showAYS}>
             <div className="hamModalItem1">
               <RiDeleteBin5Line className="hamModalItem1icon" />
             </div>
             <div>{isPrivateChannel ? "Delete Chat" : "Exit group"}</div>
           </div>
           </>
         </div>
        </div>
      </Zoom>
     </div>
    </>
  );
});

export default InfoHamburgerModal;
