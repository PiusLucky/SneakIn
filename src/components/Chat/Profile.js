import React, { Component } from "react";
import { BiArrowBack } from "react-icons/bi";
import { AiFillEdit, AiFillCamera } from "react-icons/ai";
import hamburgerCustom from "../../static/img/hamburger.svg";
import googleBadge from "../../static/img/google_badge.svg";
import Skeleton from "react-loading-skeleton";
import { connect } from "react-redux";
import firebase from "../../firebase";
import { BsInfoCircle } from "react-icons/bs";
import ProfileHamburgerModal from "../Modal/ProfileHamburgerModal";
import { shortenFileName } from "../Utility/string_shortener";
import { HiPencil } from "react-icons/hi";
import { setActiveComponent } from "../../actions";
import { statusObject } from "../Utility/statusOptions";
import { capitalizeFirstLetter } from "../Utility/capitalizeFirstLetter";
import BlackRock from "../Themefy/BlackRock";
import { BlueCharcoalExtended } from "../Themefy/BlueCharcoal";
import { ManeteeSpan } from "../Themefy/ManateeColor";
import { ProfileContent } from "../Themefy/CustomTheme";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
      joined: "",
      usersRef: firebase.database().ref("users"),
      channelsRef: firebase.database().ref("channels"),
      channelCount: 0,
      starCount: 0,
      hamModalTracker: false,
      showEditDiv: true,
      aboutMe: null,
      photoURL: ""
    };
    this.profileRef = React.createRef();
  }

  // calculations
  componentDidMount() {
    const user = this.props.loggedInUser
    if (user) {
      this.updateJoinDate(user);
      this.updateChannelCount(user);
      this.updateStarCount();
      this.updateAboutMe();
      this.updatePhotoURL();
      if(!this.props.isProfile) {
       const newObj = {
         ...statusObject,
         profileCheckTrack: true
       }
       this.props.setActiveComponent(newObj); 
     }
    }
  }

  updateJoinDate = (user) => {
    const userCreationTime = user.metadata.creationTime;
    const creationTimeArray = userCreationTime.split(" ");
    const month = creationTimeArray[2];
    const year = creationTimeArray[3];
    const fullCreationTime = `${month} ${year}`;
    this.setState({
      joined: fullCreationTime,
    });
  }

  updateAboutMe = () => {
    if(this.props.InitialAboutMe) {
      this.setState({
        aboutMe: this.props.InitialAboutMe.details
      })
    }
  }

  updateStarCount = () => {
    const NewStarCount = this.props.starCount
    const starMsgsCount = this.props.starMsgsCount

    let count1 = 0;
    let count2 = 0;
    if (NewStarCount) {
      const channelIds = Object.keys(NewStarCount);
      const NewStarCountLen = channelIds.length;
      count1 = NewStarCountLen
    }

    if(starMsgsCount) {
      const msgsIds = Object.keys(starMsgsCount);
      const NewStarCountLen2 = msgsIds.length;
      count2 = NewStarCountLen2
    }

    if(count1 || count2) {
     this.setState({ starCount: count1 + count2 }); 
    }
  }

  updatePhotoURL = () => {
    const loggedInUser = this.props.loggedInUser;
    if(loggedInUser) {
      this.setState({
        photoURL: this.getAvatarFromUserId(loggedInUser.uid)
      }) 
    }
  }


  getAvatarFromUserId = id => {
    const { usersRef } = this.state
    let url = "";
    if(id) {
      usersRef
        .child(`${id}/avatar`)
        .on("value", (snapshot) => {
          const new_url = snapshot.val();
          if (new_url !== null) {
            url = new_url
          }
        });    
    }
    return url
  }

  updateChannelCount = (user) => {
    const currentUserId = user.uid;
    const all_channel_ids = [];
    this.state.channelsRef
      .once("value")
      .then((snapshot) => {
        if(snapshot.val() !== null) {
          let channelIds = Object.keys(snapshot.val());
          channelIds.length > 0 &&
            channelIds.map((id) => {
              this.state.channelsRef.child(id).on("value", (snap) => {
                const channelObject = snap.val();
                if(channelObject !== null) {
                  if (
                    channelObject.suscribed_users && channelObject.suscribed_users.users_id.includes(currentUserId)
                  ) {
                    all_channel_ids.push(id);
                  }
                }
              });
              return all_channel_ids;
            });

          if (all_channel_ids.length > 0) {
            this.setState({
              channelCount: all_channel_ids.length,
            });
          }
        }
    });
  }

  addHamModal = () => {
    this.setState({
      hamModalTracker: true,
    });
  };

  removeHamModal = () => {
    this.setState({
      hamModalTracker: false,
    });
  };

  componentWillUnmount() {
    this.removeListeners();
    const newObj = {
      ...statusObject,
      profileCheckTrack: false
    }
    this.props.setActiveComponent(newObj);
    if(this.props.isDesktop) {
      // this.props.remountComponent();
    }
    
  }

  removeListeners = () => {
    this.state.channelsRef.off();
    this.state.usersRef.off();
  };

  componentDidUpdate(prevProps, prevState) {
    const props = this.props;
    let user = this.props.loggedInUser;
    if (prevProps !== props) {   
      if (user) {
        this.updateChannelCount(user) 
      }
    }

  }

  handleSetAbout = () => {
    this.props.handleSetIsAbout(true) 
  }

  render() {
    const { joined, channelCount, starCount, hamModalTracker, showEditDiv, aboutMe, photoURL } = this.state;
    const loggedInUser = this.props.loggedInUser;
    const {
      goBack,
      groupCheckSetter,
      dmCheckSetter,
      aboutCheckSetter,
      profileImageCheckSetter,
      handleSetIsProfileImage,
      isDesktop,
      handleSetIsAbout
    } = this.props;
    return (
      <>
        {hamModalTracker ? (
          <ProfileHamburgerModal
            goBack={this.removeHamModal}
            groupCheckSetter={groupCheckSetter}
            dmCheckSetter={dmCheckSetter}
            removeHamModal={goBack}
            showEditDiv={showEditDiv}
            ref={this.profileRef}
            aboutCheckSetter={aboutCheckSetter}
          />
        ) : (
          ""
        )}

        <BlueCharcoalExtended className="status channel-status profile-status">
          <div className="add_status channel-nav profile-nav">
            <div className="channel-nav--1">
              <div className="add_status--right" onClick={goBack}>
                <BiArrowBack className="hamModal--backItem" />
              </div>
              <div className="add_status--left">
                <p className="add_status--header profile-header">
                  Profile Info.
                </p>
              </div>
            </div>
            <div className="channel-nav--2" onClick={this.addHamModal}>
              <img src={hamburgerCustom} className="hamburger" alt="" />
            </div>
          </div>

          <BlackRock className="profile place-on-top">
            {!!loggedInUser ? (
              <div className="profile--image profile--imageAlt" onClick={!isDesktop? () => profileImageCheckSetter(): () => handleSetIsProfileImage()} >
                <img
                  src={photoURL}
                  alt=""
                  className="profile--imageItem"
                />
                <span>
                  <AiFillCamera className="profile--camera" />
                </span>
              </div>
            ) : (
              <div className="profile--imageItem">
                <Skeleton circle={true} height={96} width={96} />
              </div>
            )}

            <div className="profile--name">
              <span className="profile--nameItem">
                {!!loggedInUser ? (
                  <>
                    <ManeteeSpan as="div" className="place-center place-center-pro">
                       <img src={googleBadge} className="google_badge" alt="" /> {capitalizeFirstLetter(loggedInUser.displayName)}
                    </ManeteeSpan>
                    <div className="accept_ignore--instructions">
                      <div className="accept_ignore--icon">
                        <BsInfoCircle className="accept_ignore--iconItem" />
                      </div>
                      <ProfileContent className="accept_ignore--text">
                        This is not your pin. This name will be visible to
                        Groups or Channels you send messages or media contents.
                      </ProfileContent>
                    </div>
                  </>
                ) : (
                  <Skeleton count={1} />
                )}
              </span>
            </div>

            <div className="place-center middlelize">
              <ManeteeSpan as="div" className="profile--about">About</ManeteeSpan>
              <div className="profile--flex" onClick={isDesktop?() => this.handleSetAbout(): () => aboutCheckSetter()}>
                <ProfileContent className="profile--aboutItem">
                  {aboutMe && shortenFileName(aboutMe, 45, 0.99, "...")}
                </ProfileContent>
                <ManeteeSpan as="div">
                  <HiPencil className="about--pencil" />
                </ManeteeSpan>
              </div>
            </div>

            <div className="profile--stats profile--push-down">
              <div className="profile--channels">
                <ManeteeSpan as="div" className="profile--channels__header">Channels</ManeteeSpan>
                <div className="profile--channels__number">{channelCount}</div>
              </div>
              <div className="profile--messages">
                <ManeteeSpan as="div" className="profile--messages__header">Joined</ManeteeSpan>
                <div className="profile--messages__number">{joined}</div>
              </div>
              <div className="profile--seen">
                <ManeteeSpan as="div" className="profile--seen__header">Stars</ManeteeSpan>
                <div className="profile--seen__number">{starCount}</div>
              </div>
            </div>
          </BlackRock>

        </BlueCharcoalExtended>
        <div className="easy-icons" onClick={isDesktop?() => handleSetIsAbout(true) : () => aboutCheckSetter()}>
          <span className="camera-plate"></span>
          <div className="camera-div">
            <AiFillEdit className="plus-icon" />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.user.currentUser,
  InitialAboutMe: state.userInfo.userInfo.about,
  starCount: state.userInfo.userInfo.starred,
  starMsgsCount: state.userInfo.userInfo.starredMsgs,
});


export default connect(mapStateToProps, { setActiveComponent })(Profile);