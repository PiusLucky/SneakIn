import React, { Component } from "react";
import { BiArrowBack } from "react-icons/bi";
import hamburgerCustom from "../../static/img/hamburger.svg";
import { HiOutlinePlusCircle } from "react-icons/hi";
import Skeleton from "react-loading-skeleton";
import { connect } from "react-redux";
import moment from "moment";
import { TiGroup } from "react-icons/ti";
import InfoHamburgerModal from "../Modal/InfoHamburgerModal";
import firebase from "../../firebase";
import { capitalizeFirstLetter } from "../Utility/capitalizeFirstLetter";
import AreYouSureModal from "../Modal/AreYouSureModal";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import girl from "../../static/img/little_girl.jpg";



class GroupInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hamModalTracker: false,
      online_pc_status: false,
      usersRef: firebase.database().ref("users"),
      userInfo: {},
      areYouSureTracker: false,
      isOpen: false,
      isOpenMedia: false,
      imageDetail: null,
      imagesArray: [],
      photoIndex: 0,
    };
    this.groupInfoRef = React.createRef();
  }

  componentDidMount() {
    const { currentChannel, channelMedia } = this.props;

    if (currentChannel) {
      this.getUserInfoById(currentChannel.dm_id);
      if (channelMedia().items) {
        const firstThree = channelMedia().items.reverse().slice(0, 3);
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

  removeHamModal = () => {
    this.setState({
      hamModalTracker: false,
    });
  };

  handleHamModal = () => {
    this.setState({
      hamModalTracker: true,
    });
  };

  displayOnlineStatus = () => {
    this.setState({
      online_pc_status: true,
    });
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

  showAYS = () => {
    this.setState({
      areYouSureTracker: true,
      hamModalTracker: false,
    });
  };

  hideAYS = () => {
    this.setState({
      areYouSureTracker: false,
    });
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

  render() {
    const {
      ignoreChannel,
      goBack,
      allMessagesCount,
      channelMedia,
      removeGoGroupInfo,
      isPrivateChannel,
      getAvatarFromUserId,
      currentChannel,
      onlineDectectorById,
      removeHamModal,
      deleteChannelAsAdmin,
      isAdmin,
      currentUser,
      groupCheckSetter,
      dmCheckSetter,
      userPresenceCheckTest,
    } = this.props;

    const {
      hamModalTracker,
      online_pc_status,
      userInfo,
      areYouSureTracker,
      isOpen,
      isOpenMedia,
      imagesArray,
      photoIndex,
    } = this.state;

    const { name } = this.props.currentChannel;

    const channelMediaObject = channelMedia();
    const channelMediaCounter = channelMediaObject.count;
    const contentCount = allMessagesCount - channelMediaCounter;

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

        {isOpen && getAvatarFromUserId(currentChannel.dm_id) && (
          <Lightbox
            mainSrc={getAvatarFromUserId(currentChannel.dm_id)}
            onCloseRequest={() => this.setState({ isOpen: false })}
            enableZoom={false}
            imageTitle={currentChannel && currentChannel.name}
            imageCaption={`${
              isPrivateChannel
                ? onlineDectectorById(currentChannel.dm_id) === "online"
                  ? "ONLINE"
                  : onlineDectectorById(currentChannel.dm_id)
                : this.subscribedUsersObject().allChannelUsersCount
            }`}
          />
        )}

        {areYouSureTracker ? (
          <AreYouSureModal
            hideAYSModal={this.hideAYS}
            removeHamModal={removeHamModal}
            deleteChannelAsAdmin={deleteChannelAsAdmin}
            isAdmin={isAdmin}
            currentUser={currentUser}
            groupCheckSetter={groupCheckSetter}
            dmCheckSetter={dmCheckSetter}
            channelName={currentChannel.name}
            // currentChannelID={currentChannelID}
          />
        ) : (
          ""
        )}

        {hamModalTracker ? (
          <InfoHamburgerModal
            hamModalTracker={hamModalTracker}
            removeHamModal={this.removeHamModal}
            ignoreChannel={ignoreChannel}
            goBack={goBack}
            allMessagesCount={allMessagesCount}
            channelMedia={channelMedia}
            removeGoGroupInfo={removeGoGroupInfo}
            isPrivateChannel={isPrivateChannel}
            showAYS={this.showAYS}
            ref={this.groupInfoRef}
          />
        ) : (
          ""
        )}
        <div className="status channel-status profile-status">
          <div className="add_status channel-nav profile-nav">
            <div className="channel-nav--1">
              <div className="add_status--right" onClick={goBack}>
                <BiArrowBack className="hamModal--backItem" />
              </div>
              <div className="add_status--left">
                <p className="add_status--header profile-header">
                  {isPrivateChannel ? "Chat" : "Group"} Info.
                </p>
              </div>
            </div>
            <div className="channel-nav--2" onClick={this.handleHamModal}>
              <img src={hamburgerCustom} className="hamburger" alt="" />
            </div>
          </div>

          <div
            className="profile place-on-top background--pc place-on-top--gi gi--mobile"
            style={
              isPrivateChannel
                ? {
                    background:
                      "linear-gradient(to bottom, rgba(47, 25, 95, .5), #100e17), url(" +
                      getAvatarFromUserId(currentChannel.dm_id) +
                      ") center center",
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                  }
                : {
                  background:
                    "linear-gradient(to bottom, rgba(47, 25, 95, .5), #100e17), url(" +
                    girl +
                    ") center center",
                  backgroundPosition: "center center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed",
                }
            }
          >
            <div className="profile--image profile--image--gi">
              <div
                onClick={() => this.openLightBox()}
                className={
                  isPrivateChannel
                    ? "viewed_updates--ball2 bigger-ball-div bigger-ball-div--pc viewed_updates--ball2--pc animate--gi"
                    : "viewed_updates--ball2 bigger-ball-div bigger-ball-div--pc viewed_updates--ball2--pc viewed_updates--ball2--pc--extra animate--gi"
                }
              >
                {isPrivateChannel ? (
                  <>
                    <img
                      onLoad={() => this.displayOnlineStatus()}
                      src={getAvatarFromUserId(currentChannel.dm_id)}
                      className="viewed_updates--ball2Item bigger-ball bigger-ball--pc"
                      alt=""
                    />
                    {online_pc_status && (
                      <span
                        className={`image_pa--online-status--gi animate--gis ${
                          onlineDectectorById(currentChannel.dm_id) === "online"
                            ? "green--online"
                            : "orange--offline"
                        }`}
                      ></span>
                    )}
                  </>
                ) : (
                  <TiGroup className="viewed_updates--ball2Item bigger-ball" />
                )}
              </div>
            </div>

            <div className="profile--name channel-top-part">
              <span className="profile--nameItem">
                {!!name ? name : <Skeleton count={1} />}
              </span>
              <span className="profile--nameExtra">
                {!isPrivateChannel &&
                  `Created by ${
                    this.subscribedUsersObject().channelName
                  }, ${moment(
                    this.subscribedUsersObject().channelTimestamp
                  ).format("L")}.`}
              </span>
            </div>

            <div className="profile--stats profile--stats--gi">
              <div className="profile--channels">
                <div className="profile--channels__header">
                  {isPrivateChannel
                    ? onlineDectectorById(currentChannel.dm_id) === "online"
                      ? "Status"
                      : "Last Seen"
                    : "Users"}
                </div>
                <div className="profile--channels__number">
                  {isPrivateChannel
                    ? onlineDectectorById(currentChannel.dm_id) === "online"
                      ? "ONLINE"
                      : this.recentlyDetector(
                          userPresenceCheckTest(currentChannel.dm_id)
                        )
                    : this.subscribedUsersObject().allChannelUsersCount}
                </div>
              </div>
              <div className="profile--messages">
                <div className="profile--messages__header">Messages</div>
                <div className="profile--messages__number">{contentCount}</div>
              </div>
              <div className="profile--seen">
                <div className="profile--seen__header">Media</div>
                <div className="profile--seen__number">
                  {channelMediaCounter}
                </div>
              </div>
            </div>
          </div>

          <div className="place-center middlelize push_about_down sleek_bkgrd sleek_bkgrd--gi">
            <div className="profile--about descr_top">
              {isPrivateChannel ? "About" : "Description"}
              <span className= {isPrivateChannel ? "descr_underliner2" : "descr_underliner"}></span>
            </div>
            <div className="profile--flex column_flexer">
              <div  className= {isPrivateChannel ? "profile--aboutItem profile--aboutItem2 profile--aboutItem2--gi profile--aboutItem2_pa padd-up2 profile--break" : "profile--aboutItem profile--aboutItem2 profile--aboutItem2--gi profile--aboutItem2_pa padd-up profile--break"} >
                {isPrivateChannel ? (
                  userInfo.about === undefined ? (
                    <Skeleton count={4} />
                  ) : (
                    userInfo.about.details
                  )
                ) : (
                  currentChannel.details
                )}
              </div>
              <div className="profile_about_time profile_about_time_pa">
                {userInfo.about === undefined ? (
                  <Skeleton count={1} />
                ) : (
                  <span>
                    {capitalizeFirstLetter(currentChannel.name)}&nbsp;~&nbsp;
                    {this.iFormatDate(userInfo.about.timeUpdated)}&nbsp;
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="profile--status addBottomPadding">
            <div className="profile--img__span2row">
              {lastThreeImagesArray.length ? (
                <img
                  src={lastThreeImagesArray[0]}
                  className="profile--img__span2row img-resize"
                  alt=""
                  onClick={() =>
                    this.openMediaLightBox(imagesArray, lastThreeImagesArray[0])
                  }
                />
              ) : (
                <HiOutlinePlusCircle className="profile--img__span2row empty-plus-icon" />
              )}
            </div>
            <div className="profile--img__rhs">
              <div className="profile--img__spantoprow">
                {lastThreeImagesArray.length > 1 ? (
                  <img
                    src={lastThreeImagesArray[1]}
                    className="profile--img__spantoprow img-resize"
                    alt=""
                    onClick={() =>
                      this.openMediaLightBox(
                        imagesArray,
                        lastThreeImagesArray[1]
                      )
                    }
                  />
                ) : (
                  <HiOutlinePlusCircle className="profile--img__spantoprow empty-plus-icon" />
                )}
              </div>
              <div className="profile--img__spanbottomrow">
                {lastThreeImagesArray.length > 2 ? (
                  <img
                    src={lastThreeImagesArray[2]}
                    className="profile--img__spanbottomrow img-resize"
                    alt=""
                    onClick={() =>
                      this.openMediaLightBox(
                        imagesArray,
                        lastThreeImagesArray[2]
                      )
                    }
                  />
                ) : (
                  <HiOutlinePlusCircle className="profile--img__spanbottomrow empty-plus-icon" />
                )}
              </div>
            </div>
          </div>
        </div>
        {
          //   !isPrivateChannel && (
          //   <div className="easy-icons">
          //     <span className="camera-plate"></span>
          //     <div className="camera-div">
          //       <AiFillEdit className="plus-icon" />
          //     </div>
          //   </div>
          // )
        }
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  currentChannel: state.channel.currentChannel,
});

export default connect(mapStateToProps)(GroupInfo);
