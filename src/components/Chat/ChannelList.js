import React, { Component, useEffect, useRef, useState } from "react";
import ChannelLoader from "../Utility/loader";
import hamburgerCustom from "../../static/img/hamburger.svg";
import { FiPlus } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import { AiOutlineFire } from "react-icons/ai";
import { shortenFileName } from "../Utility/string_shortener";
import { capitalizeFirstLetter } from "../Utility/capitalizeFirstLetter";
import Sidebar from "./Sidebar";
import Cookies from "js-cookie";
import firebase from "../../firebase";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { useMediaQuery } from "react-responsive";
import ChannelModalDesktop from "../Modal/ChannelModalDesktop";
import AcceptIgnoreModalDesktop from "../Modal/AcceptIgnoreModalDesktop";
import ChannelChat from "./ChannelChat";
import PinnedChannels from "../PinnedChannels";
import UnpinnedChannels from "../UnpinnedChannels";
import GroupInfoDesktop from "./GroupInfoDesktop";
import NoChannel from "../Extras/NoChannel";
import Profile from "./Profile";
import ProfileImage from "./ProfileImage";
import About from "../About";
import ErrorPage from "../404";
import connected_svg from "../../static/img/connected.svg";
import { MdChatBubble } from "react-icons/md";
import loading_svg from "../../static/img/loading/loading.svg";
import ProfileAlt from "./ProfileAlt";
import StarredMsgsDesktop from "./StarredMessagesDesktop";
import BlackRock from "../Themefy/BlackRock";
import {
  Turquoise,
  HeaderColor,
  ButtonColor,
  CardColor,
  UserInfo,
  UserLastMsg,
  QueryMessages,
} from "../Themefy/CustomTheme";
import { Manetee, ManeteeSpan } from "../Themefy/ManateeColor";
import Preloader from "../Preloader";

const ChannelFunc = ({ _props, _state, otherProps }) => {
  const {
    sidebar,
    sidebarSwitcher,
    sidebarSwitcherReverse,
    changeChannel,
    openModal,
    dmCheckSetter,
    groupCheckSetter,
    profileCheckSetter,
    starCheckSetter,
    getLastMessageFromChannel,
    currentUser,
    getInitialActivity,
    currentChannel,
    changeChannelDesktop,
    verifyDesktop,
    childKey,
    // newKey,
    isUserSubscribed,
    verifyCrooner,
    acceptChannel,
    ignoreChannel,
    AIModalReverse,
    AIModalReverseAlt,
    AIModalReverseAltNoReload,
    isAIModal,
    isUserVerifiedTop,
    remountComponent,
    moreProps,
    error,
    loading,
    channelName,
    channelDetails,
    remountComponentOnNC,
    isCLModal,
    channelSubscriptionPair,
    unsetVerifyDesktop,
    unPinnedChannels,
    pinnedChannels,
    channels,
    lastMessagePair,
    generateLastMsgPair,
    hasChannelUpdated,
    groupCheckSetterDesktop,
    dmCheckSetterDesktop,
    dmCheckDesktop,
    users,
    online_pc_status,
    displayOnlineStatus,
    onlineDectectorById,
    getNotificationCount,
    moreThanThreeCount,
    generateLastMsgPairPrivate,
    changePrivateChannelDesktop,
    DMFinalVerifyTop,
    userInView,
    setDMFinalVerifyTop,
    remountProfileComponent,
    remountGIComponent,
    profileAltKey,
    setPrivateChannel,
    setCurrentChannel,
    starCheckDesktop,
    starCheckSetterDesktop,
    groupInfoKey,
    themeToggler,
    theme,
  } = _props;

  const {
    searchResults,
    searchTerm,
    searchTermChannel,
    searchResultsUnpinned,
    searchResultsPinned,
  } = _state;

  const bottomDiv = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [isProfile, setIsProfile] = useState(false);
  const [isGroupInfo, setIsGroupInfo] = useState(false);
  const [notProfileAlt, setNotProfileAlt] = useState(true);
  const [isAbout, setIsAbout] = useState(false);
  // const [isAboutModal, setIsAboutModal] = useState(false);
  const [isProfileImage, setIsProfileImage] = useState(false);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1201px)",
  });

  useEffect(() => {
    if (isDesktopOrLaptop) {
      sidebarSwitcher();
      setIsDesktop(true);
      fixBody();
    } else {
      sidebarSwitcherReverse();
      setIsDesktop(false);
      unFixBody();
    }
  }, [isDesktopOrLaptop, sidebarSwitcher, sidebarSwitcherReverse]);

  useEffect(() => {
    if (currentUser && isDesktopOrLaptop) {
      setTimeout(() => setIsPreloading(false), 2500);
    }
  }, [currentUser, isDesktopOrLaptop]);

  const retrieveLastMsg = (channel_id) => {
    if (lastMessagePair) {
      // console.log(lastMessagePair);
      const itemSpecific = lastMessagePair.filter(
        (item) => item !== null && item.channel_id === channel_id
      );
      if (itemSpecific.length > 0) {
        const result = {
          last_message: itemSpecific[0].message,
          timestamp: itemSpecific[0].timestamp,
          type: itemSpecific[0].type,
          sender: itemSpecific[0].sender,
        };
        return result;
      }
    }
  };

  const fixBody = () => {
    document.body.classList.add("fix_body");
  };

  const unFixBody = () => {
    document.body.classList.remove("fix_body");
  };

  const isActiveChannel = (channel) => {
    let isActive = false;
    if (currentChannel && channel) {
      if (channel.id === currentChannel.id) {
        isActive = true;
      }
    }
    return isActive;
  };

  const isActiveUser = (user) => {
    let uIV = userInView;
    if (user && uIV) {
      if (user.uid === uIV.id) {
        return true;
      }
    }
    return false;
  };

  const handleSetIsProfile = () => {
    setIsProfile(true);
    setIsProfileImage(false);
    setIsAbout(false);
  };

  const handleSetIsProfileImage = () => {
    setIsProfileImage(true);
    setIsProfile(false);
    setIsAbout(false);
  };

  const handleSetIsAbout = () => {
    setIsAbout(true);
    setIsProfileImage(false);
    setIsProfile(false);
  };

  const handleSetIsGroupInfo = () => {
    setIsProfile(true);
    setIsGroupInfo(true);
  };

  const displayUsers = (users) => {
    return users.map((user) => (
      <BlackRock
        className={`viewed_updates--content ${
          isActiveUser(user) ? "active_channel" : ""
        }`}
        key={user.uid}
        onClick={() => changePrivateChannelDesktop(user)}
      >
        <div className="pc--online">
          <img
            src={user.avatar ? user.avatar : loading_svg}
            className="viewed_updates--ball"
            alt=""
            onLoad={() => displayOnlineStatus()}
          />
          {online_pc_status && (
            <span
              className={`pc--online-status  
              ${
                onlineDectectorById(user.uid) === "online"
                  ? "green--online"
                  : "orange--offline"
              }`}
            ></span>
          )}
        </div>
        <div className="viewed_updates--left">
          <UserInfo className="add_status--header channel--header">
            <Manetee> {shortenFileName(user.name, 40, 0.99, "...")}</Manetee>
            <p className="channel--time">
              {generateLastMsgPairPrivate(currentUser, user).message ? (
                onlineDectectorById(user.uid) === "online" ? (
                  onlineDectectorById(user.uid)
                ) : (
                  <span className="channel--time">
                    {generateLastMsgPairPrivate(currentUser, user).timestamp}
                  </span>
                )
              ) : (
                <span className="channel--time">AM/PM</span>
              )}
            </p>
          </UserInfo>
          <div className="add_status--sub channel-sub push_status_down">
            {
              <UserLastMsg className="channels-lastmsg">
                {generateLastMsgPairPrivate(currentUser, user).message
                  ? generateLastMsgPairPrivate(currentUser, user).message
                  : `# Bothelper ~ Start connection!`}
              </UserLastMsg>
            }
            <div>
              {getNotificationCount(user) && (
                <span
                  className={`noti ${moreThanThreeCount(
                    getNotificationCount(user)
                  )}`}
                >
                  {getNotificationCount(user)}
                </span>
              )}
            </div>
          </div>
          <hr className="hr" />
        </div>
      </BlackRock>
    ));
  };
  
  const displayChannels = (type, select) => {
    if(typeof(channels[0]) === "object") {
      const Compo = select ? PinnedChannels : UnpinnedChannels;
      return (
        <Compo
          type={type}
          changeChannel={changeChannel}
          getInitialActivity={getInitialActivity}
          getLastMessageFromChannel={getLastMessageFromChannel}
          changeChannelDesktop={changeChannelDesktop}
          otherProps={otherProps}
          isUserSubscribed={isUserSubscribed}
          isDesktop={isDesktop}
          shortenFileName={shortenFileName}
          currentUser={currentUser}
          AIModalReverse={AIModalReverse}
          isActiveChannel={isActiveChannel}
          channelSubscriptionPair={channelSubscriptionPair}
          retrieveLastMsg={retrieveLastMsg}
          clearNotificationDesktop={otherProps.clearNotificationDesktop}
        />
      );
    } else {
      return (<ChannelLoader />);
    } 
  };

  const subscribedUsers = () => {
    if (currentChannel.suscribed_users) {
      const suscribed_users = currentChannel.suscribed_users.users_name;
      const newUsers = [];
      for (let i = 0; i < suscribed_users.length; i++) {
        const eachUsers = suscribed_users[i].split("_")[0];
        newUsers.push(eachUsers);
      }
      return newUsers;
    }
  };

  const closeModal = () => {
    setIsGroupInfo(false);
    setIsProfile(false);
  };

  if (isDesktop && isPreloading) {
    return <Preloader />;
  }

  return (
    <>
      {
        //   spinner && (
        //   <>
        //     <div className="activate_spinner"></div>
        //     <div className="spinner_overlay"></div>
        //   </>
        // )
      }

      {isCLModal && (
        <ChannelModalDesktop
          isDesktop={isDesktop}
          CLModalReverse={otherProps.CLModalReverse}
          isCLModal={isCLModal}
          submit={moreProps.submit}
          handleChange={moreProps.handleChange}
          error={error}
          loading={loading}
          removeError={moreProps.removeError}
          channelName={channelName}
          channelDetails={channelDetails}
          generateCSP={otherProps.generateCSP}
          remountComponentOnNC={remountComponentOnNC}
        />
      )}

      {isAIModal && (
        <AcceptIgnoreModalDesktop
          isDesktop={isDesktop}
          AIModalReverseAlt={AIModalReverseAlt}
          isAIModal={isAIModal}
          accept={acceptChannel}
          AIModalReverseAltNoReload={AIModalReverseAltNoReload}
          ignore={ignoreChannel}
          currentUser={currentUser}
          currentChannel={currentChannel}
          verifyCrooner={verifyCrooner}
          generateCSP={otherProps.generateCSP}
        />
      )}

      <div className="queryContainer--Cl">
        <div className="querySideBar--Cl">
          {sidebar ? (
            <Sidebar
              isDesktop={isDesktop}
              themeToggler={themeToggler}
              sidebarSwitcherReverse={sidebarSwitcherReverse}
              dmCheckSetter={dmCheckSetter}
              groupCheckSetter={groupCheckSetter}
              profileCheckSetter={profileCheckSetter}
              starCheckSetter={starCheckSetter}
              setIsProfile={handleSetIsProfile}
              isProfile={isProfile}
              groupCheckSetterDesktop={groupCheckSetterDesktop}
              dmCheckSetterDesktop={dmCheckSetterDesktop}
              setNotProfileAlt={setNotProfileAlt}
              setPrivateChannel={setPrivateChannel}
              setCurrentChannel={setCurrentChannel}
              starCheckSetterDesktop={starCheckSetterDesktop}
              closeRightModal={closeModal}
              setIsGroupInfo={setIsGroupInfo}
            />
          ) : (
            ""
          )}
        </div>

        <div
          className={`queryChannels--Cl ${
            starCheckDesktop &&
            `margin_top--0 star_view ${
              theme === "light" ? "star_view_light" : "star_view_dark"
            }`
          }`}
        >
          {isDesktopOrLaptop && !dmCheckDesktop && !starCheckDesktop && (
            <BlackRock className="cl_section">
              <div className="cl_section--up">
                <ManeteeSpan>Channels</ManeteeSpan>
                <Turquoise onClick={() => otherProps.CLModalReverse()}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-plus-circle"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </Turquoise>
              </div>
              <div className="cl_section--down">
                <input
                  value={searchTermChannel}
                  placeholder="Search channels"
                  onChange={otherProps.handleSearchChangeChannel}
                />
                {searchTermChannel && (
                  <span onClick={() => otherProps.revertSearchChannel()}>
                    <FaTimes className="search_times" />
                  </span>
                )}
              </div>
            </BlackRock>
          )}

          {isDesktopOrLaptop && dmCheckDesktop && !starCheckDesktop && (
            <BlackRock className="cl_section">
              <div className="cl_section--up">
                <ManeteeSpan>@Dm (Inbox)</ManeteeSpan>
              </div>
              <div className="cl_section--down">
                <input
                  value={searchTerm}
                  placeholder="Search Users"
                  onChange={otherProps.handleSearchChange}
                />
                {searchTerm && (
                  <span onClick={() => otherProps.revertSearch()}>
                    <FaTimes className="search_times" />
                  </span>
                )}
              </div>
            </BlackRock>
          )}

          {!dmCheckDesktop && !starCheckDesktop && (
            <BlackRock className="status channel-status">
              <div className="add_status channel-nav">
                <div className="channel-nav--1">
                  <div className="add_status--right">
                    <TiGroup className="add_status--icon" />
                  </div>
                  <div className="add_status--left">
                    <p className="add_status--header">
                      AllChannels{" "}
                      {channels.length > 0 ? `(${channels.length})` : ""}
                    </p>
                    <p className="add_status--sub">
                      List of Available channels
                    </p>
                  </div>
                </div>
                <div className="channel-nav--2" onClick={sidebarSwitcher}>
                  <img src={hamburgerCustom} className="hamburger" alt="" />
                </div>
              </div>

              <div className="viewed_updates">
                <div>
                  <BlackRock className="viewed_updates--container vuc--desktop">
                    <div className="success_well">
                      <span className="success_well--span">
                        <AiOutlineFire className="success-fire-icon" />
                        &nbsp;Channel successfully created!
                      </span>
                    </div>
                    {pinnedChannels.length > 0 &&
                      (searchTermChannel
                        ? displayChannels(searchResultsPinned, true)
                        : displayChannels(pinnedChannels, true))}

                    {unPinnedChannels.length > 0 &&
                      (searchTermChannel
                        ? displayChannels(searchResultsUnpinned, false)
                        : displayChannels(unPinnedChannels, false))}

                    <div
                      ref={bottomDiv}
                      onClick={() => otherProps.returnNothing()}
                    ></div>
                  </BlackRock>
                </div>
              </div>
            </BlackRock>
          )}

          {isDesktopOrLaptop && dmCheckDesktop && (
            <BlackRock className="status channel-status">
              <div className="add_status channel-nav">
                <div className="channel-nav--1">
                  <div className="add_status--right">
                    <TiGroup className="add_status--icon" />
                  </div>
                  <div className="add_status--left">
                    <p className="add_status--header">
                      Direct Chats {users.length > 0 ? `(${users.length})` : ""}
                    </p>
                    <p className="add_status--sub">Enjoy direct contacts...</p>
                  </div>
                </div>
                <div className="channel-nav--2" onClick={sidebarSwitcher}>
                  <img src={hamburgerCustom} className="hamburger" alt="" />
                </div>
              </div>
              {
                //START - Desktop DM logic
              }
              <div className="viewed_updates">
                <div>
                  <BlackRock className="viewed_updates--container">
                    {users.length > 0 ? (
                      searchTerm ? (
                        displayUsers(searchResults)
                      ) : (
                        displayUsers(users)
                      )
                    ) : users.length === 0 ? (
                      <div className="no_dm_container">
                        <div className="place-center middlelize push_about_down sleek_bkgrd">
                          <HeaderColor className="profile--about push_contn_down">
                            Start a <span className="themefy">Connection</span>
                          </HeaderColor>
                          <div className="profile--flex column_flexer set-width-100">
                            <div className="profile--aboutItem profile--aboutItem2 profile--break">
                              <div className="no_dm">
                                <div className="no_dm--text connected_svg">
                                  <img
                                    src={connected_svg}
                                    alt=""
                                    className="connected_svg_1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardColor className="place-center middlelize push_about_down sleek_bkgrd">
                          <HeaderColor className="profile--about">
                            {" "}
                            Pear-to-Pear chat
                          </HeaderColor>
                          <div className="profile--flex column_flexer set-width-100">
                            <div className="profile--aboutItem profile--aboutItem2 profile--break">
                              <div className="no_dm">
                                <div className="no_dm--text">
                                  There are no users on your{" "}
                                  <span className="redify">DM</span>. Add users
                                  by visiting the channel and clicking on the
                                  avatar(profile picture) of the user.
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardColor>

                        <CardColor className="place-center middlelize push_about_down sleek_bkgrd">
                          <HeaderColor className="profile--about">
                            Guide
                          </HeaderColor>
                          <div className="profile--flex column_flexer set-width-100 no_dm--text">
                            <div className="profile--aboutItem profile--aboutItem2 profile--break">
                              <ol>
                                <li>
                                  Go to{" "}
                                  <span className="themefy">channels</span>
                                </li>
                                <li>
                                  Select a{" "}
                                  <span className="themefy">channel</span> of
                                  interest
                                </li>
                                <li>
                                  Click on a{" "}
                                  <span className="redify">
                                    User's profile picture
                                  </span>
                                </li>
                                <li>
                                  Click on the{" "}
                                  <span className="redify">"Secret chat"</span>{" "}
                                  blue button
                                </li>
                                <li>Now, that's all. Enjoy SneakIn.</li>
                              </ol>
                            </div>
                          </div>
                        </CardColor>

                        <div className="profile_alt_1 profile_alt_2">
                          <ButtonColor
                            className="profile_alt_1--btn place_at_center"
                            onClick={groupCheckSetterDesktop}
                          >
                            <MdChatBubble className="profile_alt_1--svg" />
                            <span className="profile_alt_1--text">
                              Go to Channels
                            </span>
                          </ButtonColor>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ChannelLoader />
                      </>
                    )}
                  </BlackRock>
                </div>
              </div>

              {
                // END - Desktop DM logic
              }
            </BlackRock>
          )}

          {isDesktopOrLaptop && starCheckDesktop && <StarredMsgsDesktop />}

          {!isDesktop && !dmCheckDesktop && (
            <div className="easy-icons" onClick={openModal}>
              <span className="camera-plate"></span>
              <div className="camera-div">
                <FiPlus className="plus-icon" />
              </div>
            </div>
          )}
        </div>

        <QueryMessages
          setBackground={currentChannel && currentChannel.id ? null : "true"}
          className={`queryMessages--Cl ${
            currentChannel === null ? "centralize_section" : ""
          }`}
        >
          {currentChannel !== null ? (
            verifyDesktop ? (
              <ChannelChat
                key={childKey}
                isUserVerified={isUserVerifiedTop}
                ignoreChannel={_props.ignoreChannel}
                isPrivateChannel={_state.isPrivateChannel}
                onChannelSetCount={_props.onChannelSetCount}
                notifications={_state.notifications}
                channelClearNoti={_props.channelClearNoti}
                groupCheckSetter={_props.groupCheckSetter}
                dmCheckSetter={_props.dmCheckSetter}
                profileAltSetter={_props.profileAltSetter}
                currentUser={_state.currentUser}
                cCMounted={_state.cCMounted}
                cCMountedAdd={_props.cCMountedAdd}
                cCMountedMinus={_props.cCMountedMinus}
                onlineDectectorById={_props.onlineDectectorById}
                userPresenceCheckTest={_props.userPresenceCheckTest}
                isDesktop={isDesktop}
                remountComponentOnNC={remountComponentOnNC}
                unsetVerifyDesktop={unsetVerifyDesktop}
                generateLastMsgPair={generateLastMsgPair}
                hasChannelUpdated={hasChannelUpdated}
                DMFinalVerifyTop={DMFinalVerifyTop}
                setIsProfileAlt={setNotProfileAlt}
                setIsProfile={setIsProfile}
                remountProfileComponent={remountProfileComponent}
                handleSetIsGroupInfo={handleSetIsGroupInfo}
                setIsGroupInfo={setIsGroupInfo}
                groupCheckSetterDesktop={groupCheckSetterDesktop}
              />
            ) : (
              <ErrorPage currentChannel={currentChannel} />
            )
          ) : (
            <NoChannel />
          )}
        </QueryMessages>

        <div
          className={`query--Extras ${
            isGroupInfo ? "extras--30 scroll_magic--gi" : ""
          }`}
        >
          <>
            {isDesktop && isProfile && (
              <>
                <div>
                  <BlackRock as="header">
                    <ManeteeSpan className="profile_title">
                      {!isGroupInfo ? (
                        notProfileAlt ? (
                          "Profile"
                        ) : (
                          <span>
                            <span className="atSymbol">@</span>
                            {userInView.name}
                          </span>
                        )
                      ) : (
                        <>
                          <span className="atSymbol">@</span>
                          {currentChannel &&
                            capitalizeFirstLetter(
                              shortenFileName(
                                currentChannel.name,
                                20,
                                0.99,
                                "..."
                              )
                            )}
                        </>
                      )}
                    </ManeteeSpan>
                    <ul className="list-inline">
                      <li className="list-inline-item">
                        <span
                          onClick={() => closeModal()}
                          className="btn btn-outline-light text-danger sidebar-close"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-x"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </span>
                      </li>
                    </ul>
                  </BlackRock>
                  {!isGroupInfo ? (
                    notProfileAlt ? (
                      <Profile
                        isProfile={isProfile}
                        isDesktop={isDesktop}
                        remountComponent={remountComponent}
                        isProfileImage={isProfileImage}
                        handleSetIsProfileImage={handleSetIsProfileImage}
                        handleSetIsAbout={handleSetIsAbout}
                        test="1"
                      />
                    ) : (
                      <ProfileAlt
                        key={profileAltKey}
                        isDesktop={isDesktop}
                        onlineDectectorById={onlineDectectorById}
                        remountComponent={remountComponent}
                        remountProfileComponent={remountProfileComponent}
                        setDMFinalVerifyTop={setDMFinalVerifyTop}
                        dmCheckSetterDesktop={dmCheckSetterDesktop}
                      />
                    )
                  ) : (
                    <GroupInfoDesktop
                      key={groupInfoKey}
                      subscribedUsers={subscribedUsers}
                      channelName={channelName}
                      currentUser={currentUser}
                      remountGIComponent={remountGIComponent}
                    />
                  )}
                </div>
              </>
            )}

            {isDesktop && isProfileImage && (
              <div>
                <ProfileImage
                  isDesktop={isDesktop}
                  handleSetIsProfile={handleSetIsProfile}
                />
              </div>
            )}

            {isDesktop && isAbout && (
              <div className="about">
                <header>
                  <ManeteeSpan className="profile_title">About</ManeteeSpan>
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <span
                        onClick={() => setIsAbout(false)}
                        className="btn btn-outline-light text-danger sidebar-close"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-x"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </span>
                    </li>
                  </ul>
                </header>
                <About
                  isDesktop={isDesktop}
                  remountComponent={remountComponent}
                />
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
};

class ChannelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.currentUser,
      notifications: this.props.notifications,
      usersRef: firebase.database().ref("users"),
      channelsRef: firebase.database().ref("channels"),
      messagesRef: firebase.database().ref("messages"),
      uniqueUsersRef: firebase.database().ref("unique_id_of_users"),
      keepMeUpdated: null,
      spinner: true,
      searchTerm: "",
      searchResults: [],
      searchTermChannel: "",
      searchResultsUnpinned: [],
      searchResultsPinned: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const props = this.props;
    let user = props.currentUser;

    if (prevProps !== props) {
      const newNotification = this.props.notifications;
      let new_data = newNotification.filter((item) => item.count > 0);

      if (new_data.length > 0) {
        Cookies.set(user.uid, newNotification, { expires: 365 });

        // ######################################################
        // As regards notifications, if this code doesn't work on
        // mobile, please uncomment this code.
        // ######################################################
        // this.props.setChannelNotification(newNotification);
        // const serializedNotiCookie = () => {
        //   return JSON.parse(Cookies.get(user.uid));
        // };
        // this.setState({
        //   notifications: serializedNotiCookie(),
        // });
        this.setState({
          notifications: this.props.notifications,
        });
      }
    }
  }

  // Search functionality
  handleSearchChange = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
      },
      () => this.handleSearchUsers()
    );
  };

  revertSearch = () => {
    this.setState({
      searchTerm: "",
      searchResults: [],
    });
  };

  handleSearchUsers = () => {
    const users = this.props.users;
    const subscribedUsers = [...users];

    try {
      const regex = new RegExp(this.state.searchTerm, "gi");
      const searchResults = subscribedUsers.reduce((accumulator, user) => {
        if (user.name && user.name.match(regex)) {
          accumulator.push(user);
        }

        return accumulator;
      }, []);
      this.setState({ searchResults });

      if (searchResults.length === 0) {
        this.returnUsersInitial();
      }
    } catch (err) {
      this.returnUsersInitial();
    }
  };

  returnUsersInitial = () => {
    this.setState({ searchResults: this.props.users });
  };

  // End Search functionality

  // Search functionality ~ Channel Logic
  handleSearchChangeChannel = (event) => {
    this.setState(
      {
        searchTermChannel: event.target.value,
      },
      () => this.handleSearchChannel()
    );
  };

  revertSearchChannel = () => {
    this.setState({
      searchTermChannel: "",
      searchResultsUnpinned: [],
      searchResultsPinned: [],
    });
  };

  channelsIterator = (type, regex) => {
    return type.reduce((accumulator, channel) => {
      if (
        channel.name &&
        (channel.name.match(regex) || channel.details.match(regex))
      ) {
        accumulator.push(channel);
      }

      return accumulator;
    }, []);
  };

  handleSearchChannel = () => {
    const { pinnedChannels, unPinnedChannels } = this.props;
    const _unPinnedChannels = [...unPinnedChannels];
    const _pinnedChannels = [...pinnedChannels];
    try {
      const regex = new RegExp(this.state.searchTermChannel, "gi");
      const searchResultsUnpinned = this.channelsIterator(
        _unPinnedChannels,
        regex
      );
      const searchResultsPinned = this.channelsIterator(_pinnedChannels, regex);

      this.setState({ searchResultsUnpinned, searchResultsPinned });
      if (searchResultsUnpinned.length === 0) {
        this.returnChannelInitialUnpinned();
      }
      if (!searchResultsPinned) {
        this.returnChannelInitialPinned();
      }
    } catch (err) {
      this.returnChannelInitialPinned();
    }
  };

  returnChannelInitialUnpinned = () => {
    const { unPinnedChannels } = this.props;
    this.setState({ searchResultsUnpinned: unPinnedChannels });
  };

  returnChannelInitialPinned = () => {
    const { pinnedChannels } = this.props;
    this.setState({ searchResultsPinned: pinnedChannels });
  };

  // End Search functionality

  clearNotificationDesktop = (channel) => {
    const cc_from_props = this.props.currentChannel;
    if (channel && cc_from_props) {
      if (channel.id === cc_from_props.id) {
        return false;
      }
    }
    return true;
  };

  // retrieveChannelSubFromId = (id) => {
  //   let isSubscribed = false;
  //   if (channelSubscriptionPair) {
  //     const itemSpecific = channelSubscriptionPair.filter(
  //       (item) => item.channel_id === id
  //     );
  //     if (itemSpecific.length > 0) {
  //       const subscribers_array = itemSpecific[0].subscribers;
  //       if (subscribers_array.includes(currentUser.uid)) {
  //         isSubscribed = true;
  //       }
  //     }
  //   }
  //   return isSubscribed;
  // };

  // {
  //   "channel_id":"-MZVMN3jnlQ_GS_uFXtQ",
  //   "timestamp":1619747819267,"type":"image",
  //   "last_message":"https://firebasestorage.googleapis.com/v0/b/january"

  //   }

  componentDidMount() {
    this.initializeSpinner();
    const { notifications } = this.props;
    // const user = this.state.userRef;
    // console.log(this.state.userRef);
    // console.log(this.props);
    // if(user) {
    //   console.log(user);
    // this.addListeners();
    // }

    let noti = notifications;
    // const newObj = {
    //   ...statusObject,
    //   groupCheckTrack: true
    // }
    // this.props.setActiveComponent(newObj);
    this.props.generateCSP();
    this.setState({
      notifications: noti,
    });
  }

  returnNothing = () => {
    this.setState({
      keepMeUpdated: uuidv4(),
    });
  };

  initializeSpinner = () => {
    document.body.classList.add("disable-scroll");
    setTimeout(() => {
      this.setState({
        spinner: false,
      });
      document.body.classList.remove("disable-scroll");
    }, 1500);
  };

  componentWillUnmount() {
    // const newObj = {
    //   ...statusObject,
    //   groupCheckTrack: false
    // }
    // this.props.setActiveComponent(newObj);
    this.setState = (state, callback) => {
      return;
    };
  }

  getNotificationCount = (channel) => {
    let count = 0;
    this.state.notifications.forEach((notification) => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  timestampFormatter = (timestamp) => {
    let finalTime = "";
    const today = moment().format("LL");
    const initialDay = moment(timestamp).format("LL");
    if (initialDay === today) {
      finalTime = moment(timestamp).format("LT");
    } else {
      finalTime = moment(timestamp).format("l");
    }
    return finalTime;
  };

  moreThanThreeCount = (count) => {
    let new_count = "";
    if (count.length >= 3) {
      new_count = "noti_three";
    }
    return new_count;
  };

  // checkSuscriberStatusById = (id_to_check) => {
  //   const { channelsRef } = this.state;
  //   let status = false;
  //   const currentUserId = this.props.currentUser.uid;
  //   channelsRef.on("value", (snap) => {
  //     const data = snap.val();
  //     if (data !== null) {
  //       let available_ids = Object.keys(data);
  //       if (available_ids.includes(id_to_check)) {
  //         const suscribedUsersId = data[id_to_check].suscribed_users.users_id;
  //         if (suscribedUsersId.includes(currentUserId)) {
  //           status = true;
  //         }
  //       }
  //     }
  //   });
  //   return status;
  // };

  render() {
    const otherProps = {
      timestampFormatter: this.timestampFormatter,
      getNotificationCount: this.getNotificationCount,
      moreThanThreeCount: this.moreThanThreeCount,
      returnNothing: this.returnNothing,
      CLModalReverse: this.props.CLModalReverse,
      generateCSP: this.props.generateCSP,
      clearNotificationDesktop: this.clearNotificationDesktop,
      handleSearchChange: this.handleSearchChange,
      revertSearch: this.revertSearch,
      handleSearchChangeChannel: this.handleSearchChangeChannel,
      revertSearchChannel: this.revertSearchChannel,
    };

    return (
      <ChannelFunc
        _props={this.props}
        _state={this.state}
        otherProps={otherProps}
      />
    );
  }
}

export default ChannelList;
