import React, { forwardRef, useEffect } from "react";
import Zoom from "react-reveal/Zoom";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineStar, AiFillStar, AiFillPushpin } from "react-icons/ai";
import { RiDeleteBin5Line, RiCloseFill } from "react-icons/ri";
import { BsInfoCircle } from "react-icons/bs";
import { CgMenuMotion } from "react-icons/cg";
import { AiOutlinePushpin, AiOutlineVerticalAlignTop } from "react-icons/ai";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../actions";

const HamburgerModal = forwardRef((props, ref) => {
  const {
    removeHamModal,
    goGroupInfo,
    goSearch,
    ignoreChannel,
    isPrivateChannel,
    handleStar,
    isChannelStarred,
    hamModalTracker,
    handlePin,
    isChannelPinned,
    showAYSModal,
    isAdmin,
    scrollToTop
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

  const setChannelNull = () => {
    props.setCurrentChannel(null);
  };

  const scrollTopCloseModal = () => {
    removeHamModal()
    scrollToTop()
  }

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
              <div className="hamModalItem" onClick={ignoreChannel}>
                <div className="hamModalItem1">
                  <CgMenuMotion className="hamModalItem1icon" />
                </div>
                <div onClick={() => setChannelNull()}>
                  All {isPrivateChannel ? "Chats" : "Channels"}
                </div>
              </div>
              <div className="hamModalItem" onClick={goGroupInfo}>
                <div className="hamModalItem1">
                  <BsInfoCircle className="hamModalItem1icon" />
                </div>
                <div>{isPrivateChannel ? "Chat" : "Group"} Info</div>
              </div>
              {!isPrivateChannel ? (
                <div className="hamModalItem" onClick={handleStar}>
                  {isChannelStarred ? (
                    <>
                      <div className="hamModalItem1">
                        <AiFillStar className="hamModalItem1icon" />
                      </div>
                      <div>UnStar</div>
                    </>
                  ) : (
                    <>
                      <div className="hamModalItem1">
                        <AiOutlineStar className="hamModalItem1icon css-starred" />
                      </div>
                      <div>Star</div>
                    </>
                  )}
                </div>
              ) : null}
              
              {!isPrivateChannel &&
                <div className="hamModalItem" onClick={handlePin}>
                  {isChannelPinned ? (
                    <>
                      <div className="hamModalItem1">
                        <AiFillPushpin className="hamModalItem1icon rotate_pin" />
                      </div>
                      <div>UnPin {isPrivateChannel ? "Chat" : "Group"}</div>
                    </>
                  ) : (
                    <>
                      <div className="hamModalItem1">
                        <AiOutlinePushpin className="hamModalItem1icon css-starred" />
                      </div>
                      <div>Pin {isPrivateChannel ? "Chat" : "Group"}</div>
                    </>
                  )}
                </div>
              }

              {
                // <div className="hamModalItem">
                //   <div className="hamModalItem1">
                //     <AiOutlinePushpin className="hamModalItem1icon" />
                //   </div>
                //   <div>Pin {isPrivateChannel ? "Chat" : "Group"}</div>
                // </div>
              }
              <div className="hamModalItem" onClick={() => scrollTopCloseModal()}>
                <div className="hamModalItem1">
                  <AiOutlineVerticalAlignTop className="hamModalItem1icon" />
                </div>
                <div>First Message</div>
              </div>
              <div className="hamModalItem" onClick={goSearch}>
                <div className="hamModalItem1">
                  <BiSearchAlt className="hamModalItem1icon" />
                </div>
                <div>Search</div>
              </div>
              {isAdmin?
              <div className="hamModalItem" onClick={showAYSModal}>

                <div className="hamModalItem1">
                  <RiDeleteBin5Line className="hamModalItem1icon" />
                </div>
                
                  <div>Delete Channel</div>
              </div>
              :
              <div className="hamModalItem" onClick={showAYSModal}>

                <div className="hamModalItem1">
                  <RiDeleteBin5Line className="hamModalItem1icon" />
                </div>
                
                  <div>{isPrivateChannel?"Delete Chat":"Exit Channel"}</div>
              </div>
              }
            </div>
          </div>
        </Zoom>
      </div>
    </>
  );
});


// connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
export default connect(null, { setCurrentChannel }, null, { forwardRef: true })(
  HamburgerModal
);
