import React, { useEffect } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { RiWechatLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { FaUserCircle } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import { AiOutlineStar, AiFillHome, AiFillStar } from "react-icons/ai";
import { useMediaQuery } from 'react-responsive'


const BottomNav = (
  {
    handleHome,
    handleDm,
    handleStarred,
    handleYou,
    handleNone,
    homeIconState,
    dmIconState,
    starIconState,
    youIconState,
    compStatus,
  },
  ref
) => {
  const homeForwardRef = ref.homeRef;
  const bnForwardRef = ref.bnRef;
  const dmForwardRef = ref.dmRef;
  const starForwardRef = ref.starRef;
  const youForwardRef = ref.youRef;
  
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1201px)'
  })

  useEffect(() => {
    if (compStatus) {
      if (compStatus) {
        if (compStatus.groupCheckTrack) {
          handleHome();
        } else if (compStatus.dmCheckTrack) {
          handleDm();
        } else if (compStatus.profileCheckTrack) {
          handleYou();
        } else if (compStatus.starCheckTrack) {
          handleStarred();
        } else {
          handleNone();
        }
      }
    }
  }, [compStatus, handleHome, handleDm, handleStarred, handleYou, handleNone ]);

  return (
    <>
      <div className={`bottom_nav ${!isDesktopOrLaptop?"mobile_nav":""}`} ref={bnForwardRef}>
        <div className="bottom_icon" ref={homeForwardRef} onClick={handleHome}>
          {homeIconState ? (
            <span className="bottom_icon--span animate_me">
              <AiFillHome className="bottom_iconItem change_black" />
            </span>
          ) : (
            <span className="bottom_icon--span">
              <HiOutlineHome className="bottom_iconItem" />
            </span>
          )}
          <span
            className={
              homeIconState
                ? "bottom_icon--text change_black"
                : "bottom_icon--text"
            }
          >
            Home
          </span>
        </div>

        <div className="bottom_icon" ref={dmForwardRef} onClick={handleDm}>
          {dmIconState ? (
            <span className="bottom_icon--span animate_me">
              <IoIosChatbubbles className="bottom_iconItem change_black" />
            </span>
          ) : (
            <span className="bottom_icon--span">
              <RiWechatLine className="bottom_iconItem" />
            </span>
          )}
          <span
            className={
              dmIconState
                ? "bottom_icon--text change_black"
                : "bottom_icon--text"
            }
          >
            DMs
          </span>
        </div>

        <div
          className="bottom_icon"
          ref={starForwardRef}
          onClick={handleStarred}
        >
          {starIconState ? (
            <span className="bottom_icon--span animate_me">
              <AiFillStar className="bottom_iconItem change_black" />
            </span>
          ) : (
            <span className="bottom_icon--span">
              <AiOutlineStar className="bottom_iconItem" />
            </span>
          )}
          <span
            className={
              starIconState
                ? "bottom_icon--text change_black"
                : "bottom_icon--text"
            }
          >
            Starred
          </span>
        </div>

        <div className="bottom_icon" ref={youForwardRef} onClick={handleYou}>
          {youIconState ? (
            <span className="bottom_icon--span animate_me">
              <FaUserCircle className="bottom_iconItem change_black" />
            </span>
          ) : (
            <span className="bottom_icon--span">
              <CgProfile className="bottom_iconItem" />
            </span>
          )}
          <span
            className={
              youIconState
                ? "bottom_icon--text change_black"
                : "bottom_icon--text"
            }
          >
            You
          </span>
        </div>
      </div>
    </>
  );
};

export default React.forwardRef(BottomNav);
