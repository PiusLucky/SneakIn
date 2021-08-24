import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../actions";

const HamburgerModalDesktop = (props) => {
  const modalDesktop = props.modalDesktop;
  const setModalDesktop = props.setModalDesktop;
  const modalRef = useRef(null);
  const {
    goSearch,
    isPrivateChannel,
    handleStar,
    isChannelStarred,
    handlePin,
    isChannelPinned,
    showAYSModal,
    isAdmin,
    scrollToTop,
    hasChannelUpdated,
    userInViewDesktop,
    setIsProfileAlt,
    setIsProfile,
    remountProfileComponent,
    channel,
    handleSetIsGroupInfo
  } = props;


  const checkProfileDesktop = () => {
    setModalDesktop(false);
    const user_in_view = {
      id: channel.dm_id,
      name: channel.name,
    };
    remountProfileComponent();
    setIsProfile(true)
    setIsProfileAlt(false);
    userInViewDesktop(user_in_view);
  };

  const checkGroupInfoDesktop = () => {
    setModalDesktop(false);
    handleSetIsGroupInfo();
  }

  const scrollTop =() => {
    setModalDesktop(false);
    scrollToTop();
  }





  useEffect(() => {
    const hamModal = modalRef.current;

    const handleWindowClick = (event) => {
      if (modalDesktop && hamModal) {
        if (hamModal.contains(event.target)) {
          return;
        } else {
          if (event.target.className === "desktopHM") {
            return;
          } else {
            setModalDesktop(false);
          }
        }
      }
    };

    if (hamModal && modalDesktop) {
      window.addEventListener("click", handleWindowClick);
    } else {
      window.removeEventListener("click", handleWindowClick);
    }
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [modalRef, modalDesktop, setModalDesktop]);

  const goSearchNow = () => {
    goSearch();
    setModalDesktop(false);
  };



  const handleComplexPin = () => {
    handlePin();
    hasChannelUpdated();
  };

  return (
    <>
      <div ref={modalRef} className={`desktopHM ${isPrivateChannel && "desktopHM--9rem"}`}>
        <ul>
          {!isPrivateChannel && (
            <li
              onClick={() => handleStar()}
              className={isChannelStarred ? "desktopHM--active" : ""}
            >
              {isChannelStarred ? "UnStar" : "Star"}
            </li>
          )}
          {!isPrivateChannel && (
            <li
              onClick={() => handleComplexPin()}
              className={isChannelPinned ? "desktopHM--active" : ""}
            >
              {isChannelPinned ? "Unpinned" : "Pin"}{" "}
            </li>
          )}
          <li onClick={() => scrollTop()}>Go Top</li>
          <li onClick={() => goSearchNow()}>Search</li>
          {isPrivateChannel?<li onClick={() => checkProfileDesktop()}>View Profile</li>:
           (<li onClick={() => checkGroupInfoDesktop()}>Group Info</li>)}
          <span className="dropdown-divider"></span>
          <li>
            <span className="text-danger" onClick={() => showAYSModal()}>
              {isAdmin?"Delete channel":isPrivateChannel?"Remove User":"Exit Channel"}
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default connect(null, { setCurrentChannel })(HamburgerModalDesktop);
