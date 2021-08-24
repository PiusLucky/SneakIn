import React from "react";
import { TiGroup } from "react-icons/ti";
import { MdChatBubble } from "react-icons/md";
import { SubButton, TimeColorV2 } from "../Themefy/CustomTheme";
import WhiteColor from "../Themefy/WhiteColor";
import { connect } from "react-redux";
import { BlackRockV2 } from "../Themefy/BlackRock";

const UnpinnedChannels = (props) => {
  const {
    type,
    changeChannel,
    getInitialActivity,
    changeChannelDesktop,
    otherProps,
    isDesktop,
    shortenFileName,
    currentUser,
    newKey,
    isActiveChannel,
    channelSubscriptionPair,
    retrieveLastMsg,
    clearNotificationDesktop,
    theme
  } = props;


  const retrieveChannelSubFromId = (id) => {
    let isSubscribed = false;
    if (channelSubscriptionPair) {
      const itemSpecific = channelSubscriptionPair.filter(
        (item) => item !== null && item.channel_id === id
      );
      if (currentUser && itemSpecific.length > 0) {
        const subscribers_array = itemSpecific[0].subscribers;
        if(subscribers_array && subscribers_array.includes(currentUser.uid)){
          isSubscribed = true
        }
      }
    }
    return isSubscribed;
  };

  return type.map((channel_item) => (
    <BlackRockV2
      className={`viewed_updates--content ${
        isActiveChannel(channel_item)
          ? theme === "light"
            ? "active_channel"
            : "dark_active_channel"
          : ""
      }`}
      key={channel_item && channel_item.id}
      onClick={
        isDesktop
          ? () => changeChannelDesktop(channel_item)
          : () => changeChannel(channel_item)
      }
    >
      <div className="viewed_updates--ball2">
        <TiGroup className="viewed_updates--ball2Item" />
      </div>

      <div className="viewed_updates--left">
        <div className="add_status--header channel--header">
          <WhiteColor> {shortenFileName(channel_item.name, 30, 0.99, "...")}</WhiteColor>
          <TimeColorV2 className="channel--time" id={!isDesktop?"channel--time_mobile": null}>
            {channel_item && retrieveChannelSubFromId(channel_item.id) ? (
              retrieveLastMsg(channel_item.id)  &&
              retrieveLastMsg(channel_item.id).last_message !== "" ? (
                otherProps.timestampFormatter(
                  retrieveLastMsg(channel_item.id).timestamp
                )
              ) : (
                otherProps.timestampFormatter(channel_item.createdBy.timestamp)
              )
            ) : (
              <span className="channel--time--new">#New</span>
            )}
          </TimeColorV2>
        </div>
         <div className={`add_status--sub channel-sub push_status_down ${theme === "dark"?"increase_opacity":
         retrieveChannelSubFromId(channel_item.id)?"normal_opacity":"increase_opacity"}`}>
          <p className="channels-lastmsg" key={newKey} id={`${theme === "light"?"make_black":""}`} >
            {retrieveChannelSubFromId(channel_item.id) ? (
              retrieveLastMsg(channel_item.id)  &&
              retrieveLastMsg(channel_item.id).last_message !== "" ? (
                retrieveLastMsg(channel_item.id).last_message
              ) : (
                getInitialActivity(currentUser, channel_item)
              )
            ) : (
              <SubButton as="span" className={`suscribe_btn ${theme === "dark"?"increase_opacity":
              retrieveChannelSubFromId(channel_item.id)?"normal_opacity":"increase_opacity"}`}>
                <MdChatBubble className="suscribe_btn--icon" />
                &nbsp;Subscribe
              </SubButton>
            )}
          </p>

          <div className="add_flex_pin">
            {clearNotificationDesktop(channel_item) && otherProps.getNotificationCount(channel_item) &&
              retrieveChannelSubFromId(channel_item.id) && (
                <span
                  className={`noti ${otherProps.moreThanThreeCount(
                    otherProps.getNotificationCount(channel_item)
                  )}`}
                >
                   {otherProps.getNotificationCount(channel_item)}
                </span>
              )}
          </div>
        </div>
        <hr className="hr" />
      </div>
    </BlackRockV2>
  ));
};


const mapStateToProps = (state) => ({
  theme: state.theme.color
});


export default connect(mapStateToProps)(UnpinnedChannels);