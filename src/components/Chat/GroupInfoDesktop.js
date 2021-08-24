import React, { Component } from "react";
import Skeleton from "react-loading-skeleton";
import { connect } from "react-redux";
import moment from "moment";
import firebase from "../../firebase";
import { capitalizeFirstLetter } from "../Utility/capitalizeFirstLetter";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import BlackRock from "../Themefy/BlackRock";
import BlueCharcoal from "../Themefy/BlueCharcoal";
import { Manetee, ManeteeSpan } from "../Themefy/ManateeColor";

class GroupInfoDesktop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRef: firebase.database().ref("users"),
      userInfo: {},
      isOpen: false,
      isOpenMedia: false,
      imageDetail: null,
      imagesArray: [],
      photoIndex: 0,
      defaultImageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAUABQAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8hooor+iD+YQo/CiigAo9a+h/wBmn9ku4+OOmXOvapqkmjeH4pjbxGCMPNcyAAttzwqjIGSDk5GODXsOuf8ABOPSHt2OkeM763mA4F7aJMp/75KYrwa+eYHDVXRqT1W+jdvuPosPw/mOKoqvSp+69tUr/ez4Xor2T4qfsoePvhZDNeT2Met6RHlmvtLJkEa+roQGX3OCB6142DkZr1aGJo4qHPRkpLyPHxOFr4Sfs68HF+Yd6PSiiuk5Qoor2v8AZF+FUPxU+MNjFfQibR9JQ6jeIwysm0gRxn1DOVyO6hq5sTXhhaMq09oq51YXDzxdeFCnvJ2Pa/2bf2JtK1vwxb+JPiHb3Ez3yCW00dZXhEcR5DylSG3N1CgjA65JwPPv2sv2ddA+FsEGu+FPOt9OacW1zYTSmURlgSrozZbHGCCT1GK/QfX9UXSbB5CcHHFfnR+1n8aF8Za1J4U04h7SxuRJeXAPDzKCBGPZcnJ9eO3P5vlmYZhj8xUlJ8vVfZS9P6Z+qZtlmW5blbhKC5tk/tOXr+a2sfV/7Dox+zrof/Xzd/8Ao969uu9WhtHCu4Uk45NeJfsPf8m66F/183f/AKPeuQ/bdvpoPhXqnlSvE6XNsyujEMpE6YII6GvExdH6xmk6N7c02vvZ9Bg6/wBVyenXtflpp29In048ceoQkjBzXxZ+1f8Ass24gvPF3hGzW2vIgZr7TYFwk69WkjUdHHUqPvdev3l/ZC/avv7nXLLwR40vGuxdsIdN1adsyCQ/dhlP8W7orHnOAc5BH2X4gsFu7NzjkCraxeQYtd/wkv6+4yjLBcSYJ6afjF/195+MgYMMiivUv2k/h3H8OfinfQWkQi0zUV+3WyKMKm4kOg+jA4HYFa8tr9gw1eGKoxrQ2krn4jisNPB150Km8XYK+6v+Cceixx+G/GerbQZp7uC13dwqIzY/OT9K+Fa+6v8AgnHrUUvhvxnpOQJoLuC629yroy5/OP8AWvD4i5v7NqW8vzR9Bwvy/wBqU+btK33M9r/aD8Sy+GfBWt6jF9+ysZp0B7sqEgfmBX5Uq7ylpJGMkjks7sclieSTX6v/AB58JyeLfBOuaZCP3t7YzW6E9mZCFP5kV+UJjeFmjlRo5UJR0YYKkcEEeteJwlyclX+a6+7+rn0HGnP7Sj/LZ/fpf9D9Lv2G72B/2dtKVZVY293dRygH7jeaWwfwZT+NcH+25qkE3wx1KMOA0lzbogP8R81WwPwUn8K+SPhh8bvFvwhkuh4evkS0uyGnsblPMgkYDAbbkENjjKkH1zVP4jfFjxJ8VLyGbXruNoYSWitLZPLhRj1bGSSfck1o8hr/ANqfWuZcnNzee97WMlxHh1lH1PlftOXl8trXv6ficnBNJbSxzQu0U0bB0dDhlYHIIPrmv2D+G/iR/G3wz8N65MB52paZb3UuBgB2jUsPzJr8fIIJLmaOGGNpZpGCIiDJZicAAeua/YL4c+HH8EfDLw5oc2PO03TILaUg8F1jAb/x4Go4t5PZ0f5rv7tL/oXwXz+1rW+Gy++7t+p8Z/t56VGIfDmoBQJIrqa3z6h0Df8AtP8AWvkavrP9u3Wo5U8PaeGBkkupbjHsiBf/AGpXyZXscOc39nQv3f5s8Pinl/tSduyv9yD8a9q/ZF+K0Pwr+MNjLfziHR9WQ6deOxwse8gxyH0CuFyeylq8VoPNe9iaEMVRlRntJWPnMLiJ4SvCvT3i7n7SalZJfW7IcH0r4Y/aj/ZP1U6zeeLvB9k16twxlv8AS4FzJv7yxL/FnqVHOeRnJx1H7Jv7XVtd6bZeCvG16Le+gVYNO1W4bCXCDhYpGPRxwAx4YYB+b731+Jre5HJFfkCeLyDF7a/hJf19x+3tYLiTBLXT8Yv+vkz8XZYngmeKVGilQlXjcbWUjqCD0NLBDJczRwwo8ssjBUjjBZmJ6AAdTX7A+Ivhf4M8YSebrnhnSNXmxgTXlnHJIB/vEZ/WneG/hv4N8ES+dofhrR9HmxjzrOzjjkx/vAZ/Wvqf9bafJ/BfN66fl+h8f/qXV57e2XL6a/df9T5P/ZH/AGSNR0/WrLxx44smsvsrCbTdIuFxL5n8M0q/w7eqqec4Jxjn638Za4mmac67hvYdM1JrXiy102Ftrhnx618PftO/tNLqAu/DXhq7E91JmK8v4WysC9CiEdXPQkfd+vT5WUsXn+LWmv4RX9fefYxjguHME9dPxk/6+48W/aD8fp8QviZe3FvL5unWA+x27g8PtJLuPqxOD3AFecfjSKoRQAMAUtfr+Fw8cLRjRhtFWPxDF4meMrzr1N5O4UUUV1HIIRkc16/8NP2pvHnwzt4rKG/XWtJjAVLLUwZPLX0RwQyj0GSB6V5DRXNXw1HFR5K0VJeZ14bFV8JP2lCbi/I+y9L/AOCgdq8A/tLwte28uOfsl0kqk/8AAguKqa5+3xBLCw03w1ezSEcfarlIgP8AvkNXx/RXhf6uZdzX5H97/wAz6L/WjNOXl9ovWy/yPTfiJ+0X40+IyS21xerpWmycNaaflN49HcksfcZAPpXmKqFGAMD2paK93D4ajhYclGKivI+dxOLr4uftK83J+YUUUV0nKf/Z"
    };
    this.groupInfoRef = React.createRef();
  }

  componentDidMount() {
    const { currentChannel } = this.props;

    if (currentChannel) {
      this.getUserInfoById(currentChannel.dm_id);
      if (this.channelMedia().items) {
        const firstThree = this.channelMedia().items.reverse().slice(0, 3);
        this.setState({
          imagesArray: firstThree,
        });
      }
    }
  }

  openLightBox = () => {
    this.setState({
      isOpen: true,
    });
  };
  openMediaLightBox = (imagesArray, _url) => {
    this.ImageUrlIndexFinder(imagesArray, _url);
  };

  ImageUrlIndexFinder = (imageArr, _url) => {
    if (imageArr) {
      let index = imageArr.findIndex((url) => url === _url);
      this.setState({
        photoIndex: index,
        isOpenMedia: true,
      });
    }
  };

  iFormatDate = (date) => {
    return moment(date).format("MMM D");
  };

  getUserInfoById = (id) => {
    const { usersRef } = this.state;
    if (id) {
      usersRef.child(id).once("value", (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          this.setState({
            userInfo: data,
          });
        }
      });
    }
  };


  subscribedUsersObject = () => {
    const { currentChannel, subscribedUsers } = this.props;
    if (currentChannel.createdBy) {
      return {
        channelName: currentChannel.createdBy.name,
        channelTimestamp: currentChannel.createdBy.timestamp,
        allChannelUsersCount: subscribedUsers().length,
      };
    }
  };

  recentlyDetector = (timestamp) => {
    let lastSeen = "";
    const todayDay = moment().format("D");
    const todayMonth = moment().format("MMM");

    const userActiveDay = moment(timestamp).format("D");
    const userActiveMonth = moment(timestamp).format("MMM");

    if (todayDay === userActiveDay && todayMonth === userActiveMonth) {
      lastSeen = "Recently";
    } else {
      lastSeen = moment(timestamp).format("MMM D");
    }
    return lastSeen;
  };

  allMessagesCount = () => {
    const { channelMessages } = this.props
    return channelMessages.length;
  };

  channelMedia = () => {
    const { channelMessages: messages } = this.props

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


  render() {
    const {
      currentChannel,
    } = this.props;

    const {
      userInfo,
      isOpen,
      isOpenMedia,
      imagesArray,
      photoIndex,
    } = this.state;


    const { name } = this.props.currentChannel || {name:"loading..."};

    const channelMediaObject = this.channelMedia();
    const channelMediaCounter = channelMediaObject.count;
    const contentCount = this.allMessagesCount() - channelMediaCounter;

    const lastThreeImages = [];

    lastThreeImages.push(channelMediaObject.items.reverse());

    const lastThreeImagesArray = lastThreeImages[0];

    return (
      <>
        {isOpenMedia && imagesArray.length > 0 && (
          <Lightbox
            mainSrc={imagesArray[photoIndex]}
            nextSrc={imagesArray[(photoIndex + 1) % imagesArray.length]}
            prevSrc={
              imagesArray[
                (photoIndex + imagesArray.length - 1) % imagesArray.length
              ]
            }
            onCloseRequest={() => this.setState({ isOpenMedia: false })}
            onMovePrevRequest={() =>
              this.setState((previousState) => ({
                photoIndex:
                  (previousState.photoIndex + imagesArray.length - 1) %
                  imagesArray.length,
              }))
            }
            onMoveNextRequest={() =>
              this.setState((previousState) => ({
                photoIndex: (previousState.photoIndex + 1) % imagesArray.length,
              }))
            }
            imageTitle={`media_${photoIndex}`}
          />
        )}

        {isOpen && (
          <Lightbox
            mainSrc={this.state.defaultImageUrl}
            onCloseRequest={() => this.setState({ isOpen: false })}
            enableZoom={false}
            imageTitle={currentChannel && currentChannel.name}
            imageCaption={currentChannel && currentChannel.details}
          />
        )}

        <BlueCharcoal className="status channel-status profile-status status--gi">
          <BlackRock
            className="profile place-on-top background--pc place-on-top--gi"
          >
            <div className="profile--image profile--image--gi">
              <img src={this.state.defaultImageUrl} alt="" className="channelInfo--img" />
            </div>

            <div className="profile--name channel-top-part">
              <ManeteeSpan className="profile--nameItem">
                {!!name ? name : <Skeleton count={1} />}
              </ManeteeSpan>
              <span className="profile--nameExtra">
                {
                  `Created by ${
                    this.subscribedUsersObject().channelName
                  }, ${moment(
                    this.subscribedUsersObject().channelTimestamp
                  ).format("L")}.`
                }
              </span>
            </div>

            <div className="profile--stats profile--stats--gi">
              <div className="profile--channels">
                <ManeteeSpan as="div" className="profile--channels__header">
                  Users
                </ManeteeSpan>
                <ManeteeSpan as="div" className="profile--channels__number">
                  {this.subscribedUsersObject().allChannelUsersCount}
                </ManeteeSpan>
              </div>
              <div className="profile--messages">
                <div className="profile--messages__header">Messages</div>
                <ManeteeSpan as="div" className="profile--messages__number">{contentCount}</ManeteeSpan>
              </div>
              <div className="profile--seen">
                <ManeteeSpan as="div" className="profile--seen__header">Media</ManeteeSpan>
                <ManeteeSpan as="div" className="profile--seen__number">
                  {channelMediaCounter}
                </ManeteeSpan>
              </div>
            </div>
          </BlackRock>

          <BlackRock className="place-center middlelize push_about_down sleek_bkgrd sleek_bkgrd--gi">
            <ManeteeSpan as="div" className="profile--about descr_top">
              Description
              <span className= "descr_underliner"></span>
            </ManeteeSpan>
            <div className="profile--flex column_flexer">
              <ManeteeSpan as="div" className= "profile--aboutItem profile--aboutItem2 profile--aboutItem2--gi profile--aboutItem2_pa padd-up profile--break" >
                {
                  currentChannel.details
                }
              </ManeteeSpan>
              <div className="profile_about_time profile_about_time_pa">
                {userInfo.about === undefined ? (
                  <Skeleton count={1} />
                ) : (
                  <ManeteeSpan>
                    {capitalizeFirstLetter(currentChannel.name)}&nbsp;~&nbsp;
                    {this.iFormatDate(userInfo.about.timeUpdated)}&nbsp;
                  </ManeteeSpan>
                )}
              </div>
            </div>
          </BlackRock>

          <div className="profile--status addBottomPadding">
            <div className="profile--img__span2row">
              {lastThreeImagesArray.length ? (
                <img
                  src={lastThreeImagesArray[0]}
                  className="profile--img__span2row img-resize img-resizer--gi"
                  alt=""
                  onClick={() =>
                    this.openMediaLightBox(imagesArray, lastThreeImagesArray[0])
                  }
                />
              ) : (
                <Manetee 
                  as="svg"  
                  stroke="currentColor" 
                  fill="none" 
                  strokeWidth="0" 
                  viewBox="0 0 24 24" 
                  className="profile--img__span2row empty-plus-icon" 
                  height="1em" 
                  width="1em" 
                  xmlns="http://www.w3.org/2000/svg"
                  emptyImageIcon
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z">
                  </path>
                </Manetee>
              )}
            </div>
            <div className="profile--img__rhs">
              <div className="profile--img__spantoprow">
                {lastThreeImagesArray.length > 1 ? (
                  <img
                    src={lastThreeImagesArray[1]}
                    className="profile--img__spantoprow img-resize img-resizer--gi"
                    alt=""
                    onClick={() =>
                      this.openMediaLightBox(
                        imagesArray,
                        lastThreeImagesArray[1]
                      )
                    }
                  />
                ) : (
                  <Manetee 
                    as="svg"  
                    stroke="currentColor" 
                    fill="none" 
                    strokeWidth="0" 
                    viewBox="0 0 24 24" 
                    className="profile--img__spantoprow empty-plus-icon" 
                    height="1em" 
                    width="1em" 
                    xmlns="http://www.w3.org/2000/svg"
                    emptyImageIcon
                    >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z">
                    </path>
                  </Manetee>
                )}
              </div>
              <div className="profile--img__spanbottomrow">
                {lastThreeImagesArray.length > 2 ? (
                  <img
                    src={lastThreeImagesArray[2]}
                    className="profile--img__spanbottomrow img-resize img-resizer--gi"
                    alt=""
                    onClick={() =>
                      this.openMediaLightBox(
                        imagesArray,
                        lastThreeImagesArray[2]
                      )
                    }
                  />
                ) : (
                  <Manetee 
                    as="svg"   
                    stroke="currentColor" 
                    fill="none" 
                    strokeWidth="0" 
                    viewBox="0 0 24 24" 
                    className="profile--img__spanbottomrow empty-plus-icon" 
                    height="1em" 
                    width="1em" 
                    xmlns="http://www.w3.org/2000/svg"
                    emptyImageIcon
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z">
                    </path>
                  </Manetee>
                )}
              </div>
            </div>
          </div>
        </BlueCharcoal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  currentChannel: state.channel.currentChannel,
  channelMessages: state.channel.channelMessages,
});

export default connect(mapStateToProps)(GroupInfoDesktop);
