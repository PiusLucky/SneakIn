import React, { useState, useEffect, useRef } from "react";
import { RiCheckFill } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import moment from "moment";
import { shortenFileName } from "../Utility/string_shortener";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import loading_svg from "../../static/img/loading/loading.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useMediaQuery } from "react-responsive";
import { connect } from "react-redux";
import { UpperTextChat, LowerTextChat } from "../Themefy/CustomTheme";
import { TimeColor } from "../Themefy/CustomTheme";

const Message = ({
  message,
  messages,
  user,
  isPrivateChannel,
  handleStarMsg,
  starMsgChecker,
  isMessageFromChannelStarred,
  intialSMFC,
  getAvatarFromUserId,
  scrollToBottom,
  imagesArray,
  openLightBoxModal,
  userInView,
  userInViewDesktop,
  cCMounted,
  cCMountedMinus,
  audioFile,
  setIsCopied,
  currentChannel,
  messagesRef,
  usersRef,
  messageKey,
  retrieveAvatarFromId,
  setIsProfileAlt,
  setIsProfile,
  remountProfileComponent,
  setIsGroupInfo,
  theme,
}) => {
  const modalPopUp = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const messageLoaded = () => {
    setImageLoaded(true);
  };

  const messageLoadedScroll = () => {
    setImageLoaded(true);
    scrollToBottom();
  };

  const onCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  const handleStarMsgComplx = (message) => {
    handleStarMsg(message);
    setShowModal(false);
  };

  const removeMessageStar = (msg) => {
    usersRef
      .child(`${user.uid}/starredMsgs`)
      .child(msg.message_id)
      .remove((err) => {
        if (err !== null) {
          console.error(err);
        }
      });
  };

  const deleteMyMessage = (msg) => {
    const id = currentChannel.id;
    const snapData = [];
    messagesRef.child(`${id}`).once("value", (snapshot) => {
      snapData.push(snapshot.val());

      const keysArray = snapData.reduce((accumulator, data) => {
        accumulator.push(data);
        if (accumulator[0]) {
          const msgObj = accumulator[0];
          const msgObjKey = Object.keys(msgObj);
          accumulator = msgObjKey;
        }
        return accumulator;
      }, []);

      const msgsArray = snapData.reduce((accumulator, data) => {
        accumulator.push(data);
        if (accumulator[0]) {
          const msgObj = accumulator[0];
          const msgObjKey = Object.keys(msgObj);
          const msgArrayObject = msgObjKey.map((key) => {
            return msgObj[key];
          });
          accumulator = msgArrayObject;
        }
        return accumulator;
      }, []);

      const index = msgsArray.findIndex(
        (item) => item.message_id === msg.message_id
      );

      if (index !== -1) {
        const id_to_delete = keysArray[index];
        removeMessageStar(msg);
        messagesRef
          .child(`${id}/${id_to_delete}`)
          .remove((err) => {
            if (err !== null) {
              console.error(err);
            }
          })
          .then(() => {
            setShowModal(false);
          });
      }
    });
  };

  useEffect(() => {
    setImageLoaded(imageLoaded);
  }, [imageLoaded, setImageLoaded]);

  const checkUserProfile = (user) => {
    userInView(user);
  };

  const checkProfileDesktop = (user) => {
    remountProfileComponent();
    setIsGroupInfo(false);
    setIsProfile(true);
    setIsProfileAlt(false);
    userInViewDesktop(user);
  };

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1201px)",
  });

  useEffect(() => {
    const modal = modalPopUp.current;
    const handleWindowClick = (event) => {
      if (modal) {
        if (modal.contains(event.target)) {
          return;
        } else {
          setShowModal(false);
        }
      }
    };

    if (showModal) {
      window.addEventListener("click", handleWindowClick);
    } else {
      window.removeEventListener("click", handleWindowClick);
    }
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [showModal, setShowModal]);

  const isOwnMessageContainer = (message, user) => {
    return message.user.id === user.uid ? "bubble-me" : "bubble-you";
  };

  const isOwnMessage = (message, user) => {
    return message.user.id === user.uid;
  };

  const isOwnContent = (message, user) => {
    return message.user.id === user.uid
      ? "viewed_updates--content bubble-me--content"
      : "viewed_updates--content bubble-you--content";
  };

  const isOwnSingleMessage = (message, user) => {
    return message.user.id === user.uid
      ? isPrivateChannel
        ? message.image
          ? `bubble-msg ispc image_only ${theme === "dark" && "darkBg"}`
          : `bubble-msg ispc ${theme === "dark" && "receiver_msg_box"}`
        : message.image
        ? `bubble-msg image_only ${theme === "dark" && "darkBg"}`
        : `bubble-msg ${theme === "dark" && "receiver_msg_box"}`
      : isPrivateChannel
      ? message.image
        ? `bubble-you-msg ispc image_only ${theme === "dark" && "darkBg"}`
        : `bubble-you-msg ispc ${theme === "dark" && "sender_msg_box"}`
      : message.image
      ? `bubble-you-msg image_only ${theme === "dark" && "darkBg"}`
      : `bubble-you-msg ${theme === "dark" && "sender_msg_box"}`;
  };

  const lastImageDetector = (imageUrl) => {
    let result = false;
    if (imagesArray) {
      const lastImageUrl = imagesArray[imagesArray.length - 1].image;
      if (imageUrl === lastImageUrl) {
        result = true;
      }
    }
    return result;
  };

  const firstMsgToday = (rawtime) => {
    let finalTime = "";
    const today = moment().format("LL");
    const initialDay = moment(rawtime).format("LL");
    if (initialDay === today) {
      finalTime = "Today";
    } else {
      finalTime = moment(rawtime).format("MMMM D");
    }
    return finalTime;
  };

  const addClassBasedOnLength = () => {
    let cssClass = "";
    if (isOwnMessage(message, user)) {
      if (message.content) {
        if (message.content.length < 4) {
          cssClass = "remove_css_margin_alt";
        } else if (message.content.length < 6) {
          cssClass = "remove_css_margin";
        } else {
          cssClass = "";
        }
      }
    }
    return cssClass;
  };

  const getModal = () => {
    setShowModal(true);
    intialSMFC(starMsgChecker(message));
  };

  const {
    timestamp,
    user: { name: senderName },
    content,
    image,
  } = message;
  const message_timestamp = moment(timestamp).format("h:mm A");

  const getNameAndId = (message) => {
    return {
      id: message.user.id,
      name: message.user.name,
    };
  };

  const checkInputForSingleEmoji = (input) => {
    let show_big = false;
    const regex = /[a-zA-Z0-9!@#$%\\^"'&*)(+=._-]+/gi;
    if (input !== undefined) {
      const trimmedInput = input.trim();
      const doSingleSpace = trimmedInput.replace(/\s\s+/g, " ");
      const doSpaceArray = Array.from(doSingleSpace);
      const filteredEmptySpace = doSpaceArray.filter((item) => item !== " ");

      if (filteredEmptySpace.length === 1) {
        if (!doSingleSpace.match(regex)) {
          show_big = true;
        }
      }
    }
    return show_big;
  };

  const returnNothing = () => {
    return;
  };

  return (
    <>
      <div>
        {message.first_message_today && (
          <div className="private_noty_msg">
            <span className="private_noty--item private_noty--itemDown">
              {message.first_message_today && firstMsgToday(message.timestamp)}
            </span>
          </div>
        )}
      </div>

      <div className={isOwnMessageContainer(message, user)}>
        {isPrivateChannel === false ? (
          <div className={isOwnContent(message, user)}>
            {!isOwnMessage(message, user) && (
              <img
                src={
                  retrieveAvatarFromId(message.user.id)
                    ? retrieveAvatarFromId(message.user.id)
                    : loading_svg
                }
                className="viewed_updates--ball"
                alt=""
                onClick={
                  !isDesktopOrLaptop
                    ? () => checkUserProfile(getNameAndId(message))
                    : () => checkProfileDesktop(getNameAndId(message))
                }
              />
            )}
            <div className="viewed_updates--left">
              {!isOwnMessage(message, user) && (
                <p className="add_status--header">
                  {" "}
                  <UpperTextChat
                    as="span"
                    onClick={
                      !isOwnMessage(message, user)
                        ? !isDesktopOrLaptop
                          ? () => checkUserProfile(getNameAndId(message))
                          : () => checkProfileDesktop(getNameAndId(message))
                        : () => returnNothing()
                    }
                  >
                    ~ {shortenFileName(senderName, 12, 0.99, "...")}
                  </UpperTextChat>
                </p>
              )}
              {!checkInputForSingleEmoji(content) && (
                <LowerTextChat as="p" className="add_status--sub private-time">
                  {message_timestamp}
                </LowerTextChat>
              )}
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="text_box">
          <div
            className={isOwnSingleMessage(message, user)}
            id={checkInputForSingleEmoji(content) ? "singleEmojiBkg" : null}
          >
            {showModal ? (
              <div
                ref={modalPopUp}
                className={`msg_modal 
              ${addClassBasedOnLength()}
              ${
                isOwnMessage(message, user)
                  ? "push_modal_left"
                  : "msg_modal_extra"
              }`}
              >
                {!checkInputForSingleEmoji(content) && (
                  <div className="msg_modal_item">
                    <div
                      className="msg_modal_item_a"
                      onClick={() => handleStarMsgComplx(message)}
                    >
                      {starMsgChecker(message) ? "Unstar" : "Star"}
                    </div>
                  </div>
                )}
                {!image ? (
                  <React.Fragment>
                    <CopyToClipboard onCopy={onCopy} text={message.content}>
                      <div
                        className="msg_modal_item"
                        onClick={() => setShowModal(false)}
                      >
                        <div className="msg_modal_item_a">Copy</div>
                      </div>
                    </CopyToClipboard>
                    {isOwnMessage(message, user) ? (
                      <React.Fragment>
                        <div
                          className="msg_modal_item"
                          onClick={() => deleteMyMessage(message)}
                        >
                          <div className="msg_modal_item_a">Delete</div>
                        </div>
                      </React.Fragment>
                    ) : null}
                  </React.Fragment>
                ) : (
                  isOwnMessage(message, user) && (
                    <>
                      <div
                        className="msg_modal_item"
                        onClick={() => deleteMyMessage(message)}
                      >
                        <div className="msg_modal_item_a">Delete</div>
                      </div>
                    </>
                  )
                )}
              </div>
            ) : null}

            {!!content ? (
              <div
                className={
                  isOwnSingleMessage(message, user) === "bubble-you-msg"
                    ? "cc_message_content"
                    : ""
                }
                id={checkInputForSingleEmoji(content) ? "singleEmoji" : null}
              >
                {content}
              </div>
            ) : lastImageDetector(image) ? (
              <img
                src={image}
                alt=""
                className="messageImage"
                onLoad={messageLoadedScroll}
                onClick={() =>
                  openLightBoxModal(imagesArray, message, messages)
                }
              />
            ) : (
              <img
                src={image}
                alt=""
                className="messageImage"
                onLoad={messageLoaded}
                onClick={() =>
                  openLightBoxModal(imagesArray, message, messages)
                }
              />
            )}
            <div className={message.content ? "starIcon set_icon" : "starIcon"}>
              {message.image
                ? imageLoaded
                  ? starMsgChecker(message) &&
                    !checkInputForSingleEmoji(content) && (
                      <FaStar
                        className={
                          isOwnMessage(message, user)
                            ? message.image
                              ? "starIconItem_alt image_star_color"
                              : "starIconItem_alt set_white"
                            : message.image
                            ? "starIconItem image_star_color"
                            : "starIconItem set_grey"
                        }
                      />
                    )
                  : null
                : starMsgChecker(message) &&
                  !checkInputForSingleEmoji(content) && (
                    <FaStar
                      className={
                        isOwnMessage(message, user)
                          ? message.image
                            ? "starIconItem_alt image_star_color"
                            : "starIconItem_alt set_white"
                          : message.image
                          ? "starIconItem image_star_color"
                          : "starIconItem set_grey"
                      }
                    />
                  )}
              {}
            </div>

            <TimeColor
              className={
                isOwnSingleMessage(message, user) === "bubble-msg ispc" ||
                isOwnSingleMessage(message, user) === "bubble-msg"
                  ? `time_bottom_con`
                  : `time_bottom_con time_bottom_con_black ${
                      isDesktopOrLaptop
                        ? isOwnMessageContainer(message, user) === "bubble-you"
                          ? theme === "dark"
                            ? "dark--theme--2"
                            : "light--theme--2"
                          : theme === "dark"
                          ? "dark--theme--1"
                          : "light--theme--1"
                        : isOwnMessageContainer(message, user) === "bubble-you"
                          && "greyify" 
                    }`
              }
            >
              {isPrivateChannel ? (
                <span
                  className={`${
                    !isDesktopOrLaptop && checkInputForSingleEmoji(content)
                      ? "hide_time"
                      : "time_bottom"
                  } ${checkInputForSingleEmoji(content) ? "dark--time" : ""}`}
                >
                  {message.image
                    ? imageLoaded
                      ? message_timestamp
                      : null
                    : message_timestamp}
                </span>
              ) : null}
              {!checkInputForSingleEmoji(content) && (
                <RiCheckFill className={message.image && "message_check"} />
              )}
            </TimeColor>
          </div>
          <div
            onClick={() => getModal()}
            className={
              isOwnSingleMessage(message, user) === "bubble-msg ispc" ||
              isOwnSingleMessage(message, user) === "bubble-msg"
                ? "text_box_2 tb2_re_order"
                : "text_box_2"
            }
          >
            {message.image ? (
              imageLoaded ? (
                <BiDotsHorizontalRounded
                  className={`text_box_2_icon ${
                    theme === "dark" ? "hoverBright" : ""
                  }`}
                />
              ) : null
            ) : (
              <BiDotsHorizontalRounded
                className={`text_box_2_icon ${
                  theme === "dark" ? "hoverBright" : ""
                }`}
              />
            )}
          </div>
        </div>

        <br />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  theme: state.theme.color,
});

export default connect(mapStateToProps)(Message);
