import React, { useState, useEffect, useRef } from "react";
import Message from "../../Message";
import { FaRegTimesCircle } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import hamburgerCustom from "../../../static/img/hamburger.svg";
import { ImAttachment } from "react-icons/im";
import { MdSend, MdFingerprint } from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { shortenFileName } from "../../Utility/string_shortener";
import { emojis } from "../../Utility/emoji_data";
import { capitalizeFirstLetter } from "../../Utility/capitalizeFirstLetter";
import SwapArrayIndex from "../../Utility/swapArrayIndex";
import UploadMedia from "../../Modal/UploadMedia";
import HamburgerModal from "../../Modal/HamburgerModal";
import HamburgerModalDesktop from "../../Modal/HamburgerModalDesktop";
import AreYouSureModal from "../../Modal/AreYouSureModal";
import { Search as DestopSearch } from "../../Search/Desktop";
import { Search as MobileSearch } from "../../Search/Mobile";

import GroupInfo from "../GroupInfo";
import moment from "moment";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import loading_svg from "../../../static/img/loading/loading.svg";
import default_img from "../../../static/img/default.jpg";
import { useMediaQuery } from "react-responsive";
import BlackRock, { BlackRockV2, BlackRockV3 } from "../../Themefy/BlackRock";
import { ManeteeSpan } from "../../Themefy/ManateeColor";
import {
  EmojiButton,
  SendButton,
  InputChannelFunc,
} from "../../Themefy/CustomTheme";
import ErrorPage from "../../404"


const ChannelChatFunc = (props) => {
  var {
    message,
    messages,
    user,
    handleChange,
    handleSend,
    currentChannel,
    currentChannel: { name: channelName },
    channel,
    modal,
    uploadFile,
    openModal,
    closeModal,
    ignoreChannel,
    handleSearchChange,
    searchTerm,
    searchResults,
    searchResultSetter,
    returnMessageInitial,
    isPrivateChannel,
    onlineDectectorById,
    channelClearNoti,
    handleStar,
    isChannelStarred,
    handleStarMsg,
    starMsgChecker,
    isMessageFromChannelStarred,
    intialSMFC,
    groupCheckSetter,
    dmCheckSetter,
    handlePin,
    isChannelPinned,
    showAYSModal,
    hideAYSModal,
    areYouSureTracker,
    onKeyDown,
    onKeypress,
    displayTypingUsers,
    typingUsers,
    isAdmin,
    deleteChannelAsAdmin,
    currentUser,
    getAvatarFromUserId,
    openLightBoxModal,
    imagesArray,
    photoIndex,
    isOpen,
    imageDetail,
    closeLightBox,
    moveLightBoxPrev,
    moveLightBoxNxt,
    userInView,
    cCMounted,
    cCMountedAdd,
    cCMountedMinus,
    audioFile,
    userPresenceCheckTest,
    messagesRef,
    usersRef,
    messageKey,
    retrieveAvatarFromId,
    toggleModal,
    handleAddEmoji,
    handleFocus,
    messageTyped,
    searchLoading,
    remountComponentOnNC,
    remountSetChannel,
    hasChannelUpdated,
    userInViewDesktop,
    setIsProfileAlt,
    setIsProfile,
    remountProfileComponent,
    checkProfileDesktop,
    handleSetIsGroupInfo,
    setIsGroupInfo,
    groupCheckSetterV2,
    dmCheckSetterV2
  } = props;

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1201px)",
  });

  const mainContainer = useRef(null);
  const channelChatRef = useRef(null);
  const [hamModalTracker, sethamModalTracker] = useState(false);
  const [modalDesktop, setModalDesktop] = useState(false);
  const [search, setSearch] = useState(false);
  const [groupInfoTracker, setGroupInfoTracker] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEmoji, setIsEmoji] = useState(false);
  const modalPopUp = useRef(null);

  const displayEmoji = () => {
    setIsEmoji(true);
  };

  const hideEmoji = () => {
    setIsEmoji(false);
  };


  useEffect(() => {
    const modal = modalPopUp.current;
    const handleWindowClick = (event) => {
      if (modal) {
        if (modal.contains(event.target)) {
          return;
        } else {
          setIsEmoji(false);
        }
      }
    };

    if (isEmoji) {
      window.addEventListener("click", handleWindowClick);
    } else {
      window.removeEventListener("click", handleWindowClick);
    }
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [isEmoji, setIsEmoji]);

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

  const otherUsersCount = (users) => {
    const OTHER_USER_COUNT = isDesktopOrLaptop ? 3 : 2;
    let users_count = users.length - OTHER_USER_COUNT;
    if (users_count <= 0) {
      return 0;
    }
    return users_count;
  };

  const displayUsers = (users) => {
    const currentUsername = user.displayName;
    let usersArray = users.slice(0, isDesktopOrLaptop ? 3 : 2);
    const stripCurrentUser = usersArray.filter(
      (item) => item !== currentUsername
    );
    let stripLastUser = stripCurrentUser.slice(0, -1);
    let lastUserInArray = usersArray[usersArray.length - 1];
    return (
      <>
        {stripLastUser.map((user) => (
          <span key={user}>
            {shortenFileName(user, isDesktopOrLaptop ? 20 : 10, 0.99, "...")}
            {users.length > 1 && lastUserInArray && ","}
            {users.length > 1 && <span>&nbsp;</span>}
          </span>
        ))}
        {lastUserInArray && (
          <span>
            {lastUserInArray}
            {otherUsersCount(subscribedUsers()) === 0 && "."}
          </span>
        )}
      </>
    );
  };

  const scrollToBottom = () => {
    if (messages.length >= 3) {
      if (mainContainer.current) {
        setTimeout(() => {
          if (mainContainer.current) {
            mainContainer.current.scrollTop =
              mainContainer.current.scrollHeight +
              mainContainer.current.clientHeight;
          }
        }, 0);
      }
    }
  };

  const handleSendScroll = (event) => {
    handleSend(event);
    scrollToBottom();
  }

  const scrollToTop = () => {
    if (mainContainer.current) {
      setTimeout(() => {
        if (mainContainer.current) {
          mainContainer.current.scrollTop = 0;
        }
      }, 0);
    }
  };

  const displayMessages = (messages) => {
    return (
      messages.length > 0 &&
      messages.map((message) => (
        <Message
          key={`${message.timestamp}_${messageKey}`}
          isPrivateChannel={isPrivateChannel}
          message={message}
          user={user}
          handleStarMsg={handleStarMsg}
          starMsgChecker={starMsgChecker}
          isMessageFromChannelStarred={isMessageFromChannelStarred}
          intialSMFC={intialSMFC}
          getAvatarFromUserId={getAvatarFromUserId}
          scrollToBottom={scrollToBottom}
          imagesArray={imagesArray}
          messages={messages}
          openLightBoxModal={openLightBoxModal}
          userInView={userInView}
          userInViewDesktop={userInViewDesktop}
          cCMounted={cCMounted}
          cCMountedAdd={cCMountedAdd}
          cCMountedMinus={cCMountedMinus}
          audioFile={audioFile}
          setIsCopied={setIsCopied}
          currentChannel={currentChannel}
          messagesRef={messagesRef}
          usersRef={usersRef}
          retrieveAvatarFromId={retrieveAvatarFromId}
          setIsProfileAlt={setIsProfileAlt}
          setIsProfile={setIsProfile}
          setIsGroupInfo={setIsGroupInfo}
          remountProfileComponent={remountProfileComponent}
        />
      ))
    );
  };

  const allMessagesCount = (messages) => {
    return messages.length;
  };

  const channelMedia = () => {
    const item_keeper = [];
    if (messages.length) {
      messages.map(
        (item) => item.hasOwnProperty("image") && item_keeper.push(item.image)
      );
    }

    return {
      items: item_keeper,
      count: item_keeper.length,
    };
  };

  const goNormal = () => {
    returnMessageInitial();
    setSearch(false);
  };

  const goNormalDesktop = () => {
    searchResultSetter();
    setSearch(false);
    scrollToBottom();
  };

  const openModalExtra = () => {
    goNormal();
    openModal();
  };

  useEffect(() => {
    if (props.forwardRef.current) {
      props.forwardRef.current.onclick = () => {
        searchResultSetter();
        setSearch(false);
      };
    }
  }, [search, searchResultSetter, props.forwardRef]);

  useEffect(() => {
    if (messages.length >= 3) {
      if (mainContainer.current) {
        props.forwardRef.current.click();
        setTimeout(() => {
          if (mainContainer.current) {
            mainContainer.current.scrollTop =
              mainContainer.current.scrollHeight +
              mainContainer.current.clientHeight;
          }
        }, 0);
      }
    }
  }, [messages.length, props.forwardRef]);

  const removeHamModal = () => {
    sethamModalTracker(false);
  };

  const handleHamModal = () => {
    sethamModalTracker(true);
  };

  const goSearch = () => {
    setSearch(true);
    sethamModalTracker(false);
  };

  const goGroupInfo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setGroupInfoTracker(true);
    sethamModalTracker(false);
  };

  const removeGoGroupInfo = () => {
    setGroupInfoTracker(false);
    sethamModalTracker(false);
  };

  const goBack = () => {
    setGroupInfoTracker(false);
  };


  const async_emojies = async (index) => {
    const FROM_POSITION = index;
    const TO_POSITION = 0;
    const existing_emojies = await getItemFromStorage();
    const newEmojiArray = await SwapArrayIndex(
      existing_emojies,
      FROM_POSITION,
      TO_POSITION
    );
    return newEmojiArray;
  };

  const handleEmoji = (item, index) => {
    hideEmoji();
    handleAddEmoji(item);
    async_emojies(index).then((data) => {
      localStorage.setItem("emojisFromStorage", [...data]);
    });
  };

  const serializedEmojis = () => {
    // Since JSON.parse works poorly with emojis.
    // It's optimal we retrieve our localStorage data as string
    // and then convert it to array afterwards.
    const data = localStorage.getItem("emojisFromStorage").split(",");
    return data;
  };

  const getItemFromStorage = () => {
    let available_emojies;
    if (localStorage.getItem("emojisFromStorage") === null) {
      available_emojies = [...emojis];
    } else {
      available_emojies = serializedEmojis();
    }
    return available_emojies;
  };

  const showEmojis = () => {
    return getItemFromStorage().map((item, index) => (
      <li key={index} onClick={() => handleEmoji(item, index)}>
        {item}
      </li>
    ));
  };

  const checkGroupInfoDesktop = () => {
    setModalDesktop(false);
    handleSetIsGroupInfo();
  };

  const inputClassName = () => {
    const initialClass = "input-div--input";
    if (props.isDesktop) {
      return `${initialClass} input-div--input_2`;
    }
    return initialClass;
  };

  const tryTypingUser = () => {  
    try{
      if(typingUsers && typingUsers.length > 0) {
        return  displayTypingUsers(typingUsers)
      }else {
        if(isPrivateChannel) {
          return  onlineDectectorById(currentChannel.dm_id)
        }
        if(isPrivateChannel === false) {
          if(subscribedUsers().length === 0 ||
        subscribedUsers().length === 1) {
            return <span>You</span>
          }else{
            return <>
              {displayUsers(subscribedUsers())}
              <span>
                &nbsp;+{otherUsersCount(subscribedUsers())}{" "}
                others.
              </span>
            </>
          }
        }
      }
    }catch(err){}
  }

  return (
    <>
      {isOpen && imagesArray.length > 0 && (
        <Lightbox
          mainSrc={imagesArray[photoIndex].image}
          nextSrc={imagesArray[(photoIndex + 1) % imagesArray.length].image}
          prevSrc={
            imagesArray[
              (photoIndex + imagesArray.length - 1) % imagesArray.length
            ].image
          }
          onCloseRequest={() => closeLightBox()}
          onMovePrevRequest={() => moveLightBoxPrev()}
          onMoveNextRequest={() => moveLightBoxNxt()}
          imageTitle={imageDetail && imageDetail.name}
          imageCaption={moment(imageDetail && imageDetail.timestamp).calendar()}
        />
      )}

      {areYouSureTracker ? (
        <AreYouSureModal
          hideAYSModal={hideAYSModal}
          removeHamModal={removeHamModal}
          channelName={channelName}
          deleteChannelAsAdmin={deleteChannelAsAdmin}
          isAdmin={isAdmin}
          currentUser={currentUser}
          groupCheckSetter={groupCheckSetterV2}
          dmCheckSetter={dmCheckSetter}
          isDesktop={isDesktopOrLaptop}
          areYouSureTracker={areYouSureTracker}
          remountComponentOnNC={remountComponentOnNC}
          remountSetChannel={remountSetChannel}
          // currentChannelID={currentChannelID}
        />
      ) : (
        ""
      )}
      {hamModalTracker ? (
        <HamburgerModal
          removeHamModal={removeHamModal}
          goGroupInfo={goGroupInfo}
          goSearch={goSearch}
          ignoreChannel={ignoreChannel}
          isPrivateChannel={isPrivateChannel}
          handleStar={handleStar}
          isChannelStarred={isChannelStarred}
          ref={channelChatRef}
          hamModalTracker={hamModalTracker}
          handlePin={handlePin}
          isChannelPinned={isChannelPinned}
          showAYSModal={showAYSModal}
          isAdmin={isAdmin}
          scrollToTop={scrollToTop}
        />
      ) : (
        ""
      )}

      {groupInfoTracker ? (
        <GroupInfo
          handleHamModal={handleHamModal}
          hamModalTracker={hamModalTracker}
          removeHamModal={removeHamModal}
          goGroupInfo={goGroupInfo}
          ignoreChannel={ignoreChannel}
          goBack={goBack}
          allMessagesCount={allMessagesCount(messages)}
          channelMedia={channelMedia}
          removeGoGroupInfo={removeGoGroupInfo}
          isPrivateChannel={isPrivateChannel}
          subscribedUsers={subscribedUsers}
          getAvatarFromUserId={getAvatarFromUserId}
          onlineDectectorById={onlineDectectorById}
          showAYSModal={showAYSModal}
          hideAYSModal={hideAYSModal}
          channelName={channelName}
          deleteChannelAsAdmin={deleteChannelAsAdmin}
          isAdmin={isAdmin}
          currentUser={currentUser}
          groupCheckSetter={groupCheckSetter}
          dmCheckSetter={dmCheckSetter}
          userPresenceCheckTest={userPresenceCheckTest}
        />
      ) : (
        <>
          <div ref={channelChatRef}>
            <BlackRock
              className={`status private-chat private-chat2 ${
                props.isDesktop ? "private-chat2b" : ""
              }`}
            >
              {props.isDesktop ? (
                <div>
                  <BlackRockV2 className="chat-header">
                    <div className="chat-header-user">
                      {search ? (
                        <DestopSearch
                          goNormalDesktop={goNormalDesktop}
                          handleSearchChange={handleSearchChange}
                          searchLoading={searchLoading}
                        />
                      ) : (
                        <>
                          <figure className="avatar">
                            <img
                              src={
                                channel.dm_id
                                  ? getAvatarFromUserId(channel.dm_id)
                                  : default_img
                              }
                              className="rounded-circle"
                              alt=""
                              onClick={
                                isPrivateChannel
                                  ? () => checkProfileDesktop()
                                  : () => checkGroupInfoDesktop()
                              }
                            />
                          </figure>
                          <div>
                            <ManeteeSpan
                              as="h5"
                              onClick={
                                isPrivateChannel
                                  ? () => checkProfileDesktop()
                                  : () => checkGroupInfoDesktop()
                              }
                            >
                              {shortenFileName(
                                channelName,
                                props.isDesktop ? 42 : 22,
                                0.99,
                                "..."
                              )}
                            </ManeteeSpan>
                            <small className="text-success">
                              <i>
                                {typingUsers && typingUsers.length > 0 ? (
                                  displayTypingUsers(typingUsers)
                                ) : isPrivateChannel ? (
                                  onlineDectectorById(currentChannel.dm_id)
                                ) : subscribedUsers().length === 0 ||
                                  subscribedUsers().length === 1 ? (
                                  <span>You</span>
                                ) : (
                                  <>
                                    {displayUsers(subscribedUsers())}
                                    {otherUsersCount(subscribedUsers()) !==
                                      0 && (
                                      <span>
                                        &nbsp;+
                                        {otherUsersCount(
                                          subscribedUsers()
                                        )}{" "}
                                        others.
                                      </span>
                                    )}
                                  </>
                                )}
                              </i>
                            </small>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="cl_section--up_b top_right_icon">
                      <span>
                        {modalDesktop && (
                          <HamburgerModalDesktop
                            setModalDesktop={setModalDesktop}
                            modalDesktop={modalDesktop}
                            goSearch={goSearch}
                            ignoreChannel={ignoreChannel}
                            isPrivateChannel={isPrivateChannel}
                            handleStar={handleStar}
                            isChannelStarred={isChannelStarred}
                            hamModalTracker={hamModalTracker}
                            handlePin={handlePin}
                            isChannelPinned={isChannelPinned}
                            showAYSModal={showAYSModal}
                            isAdmin={isAdmin}
                            scrollToTop={scrollToTop}
                            hasChannelUpdated={hasChannelUpdated}
                            userInViewDesktop={userInViewDesktop}
                            setIsProfileAlt={setIsProfileAlt}
                            setIsProfile={setIsProfile}
                            remountProfileComponent={remountProfileComponent}
                            channel={channel}
                            handleSetIsGroupInfo={handleSetIsGroupInfo}
                          />
                        )}
                      </span>
                      <div onClick={() => setModalDesktop(true)}>
                        <ManeteeSpan
                          as="svg"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-more-horizontal"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </ManeteeSpan>
                      </div>
                    </div>
                  </BlackRockV2>
                </div>
              ) : (
                <div>
                  {search ? (
                    <MobileSearch
                      goNormal={goNormal}
                      handleSearchChange={handleSearchChange}
                    />
                  ) : (
                    <div className="add_status channel-nav">
                      <div className="channel-nav--1">
                        <div className="add_status--right">
                          <div className="icon_arrow">
                            <div className="icon_arrow--back">
                              <BiArrowBack
                                className="searchBack"
                                onClick={
                                  isPrivateChannel
                                    ? () => dmCheckSetterV2()
                                    : () => groupCheckSetterV2()
                                }
                              />
                            </div>
                            <div onClick={() => goGroupInfo()}>
                              {isPrivateChannel ? (
                                <div className="viewed_updates--ball adjust_ball">
                                  <img
                                    src={
                                      channel.dm_id
                                        ? getAvatarFromUserId(channel.dm_id)
                                        : loading_svg
                                    }
                                    className="viewed_updates--ball viewed_updates--ball_a"
                                    alt=""
                                  />
                                </div>
                              ) : (
                                <div className="viewed_updates--ball2 adjust_ball">
                                  <TiGroup className="viewed_updates--ball2Item" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className="add_status--left"
                          onClick={() => goGroupInfo()}
                        >
                          <p className="add_status--header private--header">
                            {shortenFileName(channelName, 22, 0.99, "...")}
                          </p>
                          <div className="add_status--sub success-color">
                            {tryTypingUser()}
                          </div>
                        </div>
                      </div>
                      <div className="channel-nav--2" onClick={handleHamModal}>
                        <img
                          src={hamburgerCustom}
                          className="hamburger"
                          alt=""
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!!modal ? (
                <UploadMedia
                  modal={modal}
                  closeModal={closeModal}
                  uploadFile={uploadFile}
                  currentChannel={currentChannel}
                  channelClearNoti={channelClearNoti}
                />
              ) : (
                <>
                  <div
                    className={`viewed_updates viewed_updates2 ${
                      props.isDesktop ? "viewed_updates2b" : ""
                    }`}
                    ref={mainContainer}
                  >
                    {messages.length ? (
                      <div>
                        <div
                          className={`viewed_updates--container viewed_updates--container2 private_updates private_updates2 ${
                            props.isDesktop ? "full_width" : ""
                          }`}
                          style={{ height: 500 }}
                        >
                          {!isPrivateChannel ? (
                            <div className="private_noty">
                              <span className="private_noty--item private_noty--itemUp">
                                {moment(
                                  currentChannel.createdBy.timestamp
                                ).format("LL")}
                                .
                              </span>
                              <span className="private_noty--item private_noty--itemDown">
                                {capitalizeFirstLetter(
                                  currentChannel.createdBy.name
                                )}{" "}
                                created "
                                {shortenFileName(
                                  currentChannel.name,
                                  22,
                                  0.99,
                                  "..."
                                )}
                                "
                              </span>
                            </div>
                          ) : (
                            <div className="private_noty"> </div>
                          )}

                          {searchTerm
                            ? displayMessages(searchResults)
                            : displayMessages(messages)}
                        </div>
                      </div>
                    ) : (
                      <>
                        <ErrorPage noMessages="active" />
                      </>
                    )}
                  </div>
                  <div />
                </>
              )}
            </BlackRock>
            {!isDesktopOrLaptop ? (
              <form>
                <div
                  className={`input-div ${
                    props.isDesktop ? "input-div_2" : ""
                  }`}
                >
                  <div
                    className={`input-div--container ${
                      props.isDesktop ? "input-div--container_2" : ""
                    }`}
                  >
                    <textarea
                      type="text"
                      onChange={handleChange}
                      onKeyDown={onKeyDown}
                      onKeyPress={onKeypress}
                      name="message"
                      value={message}
                      ref={props.forwardRef}
                      placeholder="Type a message"
                      className={inputClassName()}
                      autoFocus
                    />
                    <div className="input-div--emoji">
                      <MdFingerprint className="input-div--emojiItem" />
                    </div>
                    <div className="input-div--attach">
                      {!!modal ? (
                        <FaRegTimesCircle
                          className="input-div--attachItem upload_modal_closer"
                          onClick={closeModal}
                        />
                      ) : (
                        <ImAttachment
                          className="input-div--attachItem"
                          onClick={() => openModalExtra()}
                        />
                      )}
                    </div>
                  </div>
                  <div className="input-div--sendBtn">
                    <span
                      className="input-div--sendBtnSpan"
                      onClick={handleSendScroll}
                    >
                      <MdSend className="input-div--sendBtnItem" />
                    </span>
                  </div>
                </div>
              </form>
            ) : (
              <BlackRockV3 className="chat-footer">
                <form className="d-flex">
                  <div className="dropdown">
                    <EmojiButton
                      className="btn btn-light-info btn-floating mr-3"
                      data-toggle="dropdown"
                      title="Emoji"
                      type="button"
                      aria-expanded="false"
                      onClick={() => displayEmoji()}
                    >
                      <i className="mdi mdi-face"></i>
                    </EmojiButton>
                    {isEmoji && (
                      <div
                        className="dropdown-menu dropdown-menu-big p-0"
                        ref={modalPopUp}
                      >
                        <div className="emojis chat-emojis">
                          <div className="recently_used">
                            Custom Emojis Editon
                          </div>
                          <ul>{showEmojis()}</ul>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn btn-light-info btn-floating mr-3"
                      title="Emoji"
                      type="button"
                      onClick={() => toggleModal()}
                    >
                      <i
                        className="mdi mdi-plus"
                        id={modal ? "mdi-plus-rotate" : "mdi-plus-rotate-alt"}
                      ></i>
                    </button>
                  </div>
                  <InputChannelFunc
                    type="text"
                    onChange={handleChange}
                    onKeyDown={onKeyDown}
                    onKeyPress={onKeypress}
                    name="message"
                    value={messageTyped}
                    ref={props.forwardRef}
                    placeholder="Shortcut [Ctrl] + [Enter] to send!"
                    className="form-control form-control-main"
                    autoFocus
                    onFocus={handleFocus}
                    autoComplete="off"
                  />
                  <div>
                    <SendButton
                      className="btn btn-primary ml-2 btn-floating"
                      onClick={handleSendScroll}
                    >
                      <i className="mdi mdi-send"></i>
                    </SendButton>
                  </div>
                </form>
              </BlackRockV3>
            )}
            {isCopied && (
              <div className="copiedCC">
                <span>Copied!</span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default React.forwardRef((props, ref) => (
  <ChannelChatFunc {...props} forwardRef={ref} />
));
