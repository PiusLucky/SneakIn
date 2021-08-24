import React, { useEffect } from "react";
import { connect } from "react-redux";
import { BiMessageDetail } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { AiOutlineStar } from "react-icons/ai";
import { TiGroup } from "react-icons/ti";
import logo from "../../static/img/logo_no_gradient.svg";
import Skeleton from "react-loading-skeleton";
import Zoom from "react-reveal/Zoom";
import { CgLogOff } from "react-icons/cg";
import firebase from "../../firebase";
import SideBarThemefy from "../Themefy/SideBarThemefy";
import { SideBarIcon, ThemeToggleButton } from "../Themefy/CustomTheme";




const Sidebar = ({
  userInfo,
  sidebarSwitcherReverse,
  dmCheckSetter,
  groupCheckSetter,
  profileCheckSetter,
  starCheckSetter,
  isDesktop,
  setIsProfile,
  isProfile,
  groupCheckSetterDesktop,
  dmCheckSetterDesktop,
  setNotProfileAlt,
  setPrivateChannel,
  setCurrentChannel,
  starCheckSetterDesktop,
  closeRightModal,
  themeToggler,
  setIsGroupInfo
}) => {
  const signOut = () => {
    firebase.auth().signOut();
  };

  useEffect(() => {
    document.body.classList.add("disable-scroll");
    return () => {
      document.body.classList.remove("disable-scroll");
    };
  }, []);

  // const [theme, setTheme] = useState('light');
  // const setMode = mode => {
  //     localStorage.setItem('theme', mode)
  //     setTheme(mode)
  // };

  // const themeToggler = () => {
  //     theme === 'light' ? setMode('dark') : setMode('light')
  // };

  // useEffect(() => {
  //     const localTheme = localStorage.getItem('theme');
  //     localTheme ? setTheme(localTheme) : setMode('light')
  // }, []);



  const setProfile = () => {
    setIsGroupInfo(false);
    setNotProfileAlt(true);
    setIsProfile(!isProfile);
  };


  const dmCheckSetterDesktop_max = () => {
    setCurrentChannel(null);
    setPrivateChannel(false);
    dmCheckSetterDesktop();
    closeRightModal();
  };

  const groupCheckSetterDesktop_max = () => {
    setCurrentChannel(null);
    setPrivateChannel(false);
    groupCheckSetterDesktop();
    closeRightModal();
  };

  const starCheckSetterDesktop_max = () => {
    setCurrentChannel(null);
    setPrivateChannel(false);
    starCheckSetterDesktop();
    closeRightModal();
  };

  const mainDiv = (
    <>
      {!isDesktop && (
        <div className="dim_background" onClick={sidebarSwitcherReverse}></div>
      )}
      <SideBarThemefy className={isDesktop ? "sidebar_desktop" : "sidebar"}>
        <div className="group1">
          <a href="/">
            <img src={logo} className="sidebar__logo" alt="" />
          </a>
          <SideBarIcon className="sidebar__icons--span">
            <BiMessageDetail
              className="sidebar__icons"
              onClick={
                isDesktop
                  ? () => dmCheckSetterDesktop_max()
                  : () => dmCheckSetter()
              }
            />
          </SideBarIcon>
          <SideBarIcon className="sidebar__icons--span">
            <TiGroup
              className="sidebar__icons"
              onClick={
                isDesktop
                  ? () => groupCheckSetterDesktop_max()
                  : () => groupCheckSetter()
              }
            />
          </SideBarIcon>
          <SideBarIcon className="sidebar__icons--span">
            <FiUser
              className="sidebar__icons"
              onClick={
                isDesktop ? () => setProfile() : () => profileCheckSetter()
              }
            />
          </SideBarIcon>
          <SideBarIcon className="sidebar__icons--span">
            <AiOutlineStar
              className="sidebar__icons"
              onClick={
                isDesktop
                  ? () => starCheckSetterDesktop_max()
                  : () => starCheckSetter()
              }
            />
          </SideBarIcon>
          <SideBarIcon className="sidebar__icons--span">
            <CgLogOff className="sidebar__icons" onClick={signOut} />
          </SideBarIcon>
        </div>
        <div className="group2">
          {userInfo ? (
            <>
              {isDesktop && 
                <ThemeToggleButton className="toggleWrap">
                  <button className="toggleButton" onClick={() => themeToggler()}> 
                  <svg
                    stroke="currentColor"
                    fill="rgba(0,0,0,.7)"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                  >
                    <path d="M253.125 18.563c-131.53 0-238.375 106.813-238.375 238.343 0 131.53 106.846 238.344 238.375 238.344 131.53 0 238.344-106.815 238.344-238.344 0-131.528-106.816-238.344-238.345-238.344zm-23.938 52.093c40.517 0 77.988 12.904 108.532 34.813-5.597-.624-11.302-.97-17.064-.97-84.157 0-152.375 68.25-152.375 152.406 0 84.157 68.22 152.375 152.376 152.375 5.762 0 11.467-.313 17.063-.936-30.545 21.91-68.016 34.812-108.533 34.812-102.98 0-186.28-83.272-186.28-186.25 0-102.977 83.3-186.25 186.28-186.25z"></path>
                  </svg>
                  Theme
                  </button>
                </ThemeToggleButton>
              }
              
              <img
                src={userInfo.avatar}
                className="sidebar__photourl"
                alt=""
                onClick={
                  isDesktop ? () => setProfile() : () => profileCheckSetter()
                }
              />
            </>
          ) : (
            <div className="group2__skeleton">
              <Skeleton circle={true} height={50} width={50} />
            </div>
          )}
        </div>
      </SideBarThemefy>
    </>
  );
  return (
    <section className="chatBody">
      {!isDesktop ? <Zoom left>{mainDiv}</Zoom> : mainDiv}
    </section>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.userInfo.userInfo,
});

export default connect(mapStateToProps)(Sidebar);
