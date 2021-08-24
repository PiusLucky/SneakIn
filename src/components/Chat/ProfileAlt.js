import React, { Component } from "react";
import { BiArrowBack } from "react-icons/bi";
import { MdChatBubble, MdZoomOutMap } from "react-icons/md";
import hamburgerCustom from "../../static/img/hamburger.svg";
import Skeleton from "react-loading-skeleton";
import { connect } from "react-redux";
import firebase from "../../firebase";
import ProfileHamburgerModal from "../Modal/ProfileHamburgerModal";
import { shortenFileName } from "../Utility/string_shortener";
import { setActiveComponent, setCurrentChannel, setPrivateChannel } from "../../actions";
import { statusObject } from "../Utility/statusOptions";
import { capitalizeFirstLetter } from "../Utility/capitalizeFirstLetter";
import moment from "moment";
import loading_svg from "../../static/img/loading/loading.svg";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import BlackRock from "../Themefy/BlackRock";
import { ManeteeSpan } from "../Themefy/ManateeColor";
import { ProfileContent, ButtonColor } from "../Themefy/CustomTheme";
import { BlueCharcoalExtended } from "../Themefy/BlueCharcoal";


class ProfileAlt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
      joined: "",
      usersRef: firebase.database().ref("users"),
      channelsRef: firebase.database().ref("channels"),
      messagesRef: firebase.database().ref("messages"),
      uniqueUsersRef: firebase.database().ref("unique_id_of_users"),
      privateMessagesIdRef: firebase.database().ref("privateMessagesIds"),
      channelCount: 0,
      starCount: 0,
      hamModalTracker: false,
      showEditDiv: false,
      aboutMe: null,
      userInfo: {},
      isOpen: false,
      imageDetail: null,
      online_pc_status: false
    };
    this.profileRef = React.createRef();
  }


  componentDidMount() {
    const { userInView} = this.props 
    if (userInView) {
      this.updateChannelCount(userInView.id);
      this.getUserInfoById(userInView.id)
    }
  }

  displayOnlineStatus = () => {
    this.setState({
      online_pc_status: true
    })
  }





  formatDate = date => {
    return moment(date).format('ll');
  }

  
  iFormatDate = date => {
    return moment(date).format('MMM D')
  }


  updateStarCount = (userInView, userInfo) => {
    this.updateChannelCount(userInView.id)
    const NewStarCount = userInfo.starred
    const starMsgsCount = userInfo.starredMsgs

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


  getUserInfoById = (id) => {
    const { usersRef } = this.state
    const { userInView } = this.props
    if(id) {
      usersRef
        .child(id)
        .once("value", (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            this.setState({
              userInfo : data
            }, () => this.updateStarCount(userInView, data))
          }
        });    
    }
  }


  updateChannelCount = (id) => {
    const currentUserId = id;
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
                    channelObject.suscribed_users.users_id.includes(currentUserId)
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

  removeListeners = () => {
    this.state.channelsRef.off();
    this.state.usersRef.off();
  };

  componentWillUnmount() {
    this.removeListeners();
    const newObj = {
      ...statusObject,
      profileCheckTrack: false
    }
    this.props.setActiveComponent(newObj);
  }

  openLightBox = () => {
    this.setState({
      isOpen: true
    })
  }

 singularitySuffix = (num, str) => {
   let newString = ""
   let realNum = Number(num)
   if(realNum === 0 || realNum === 1) {
     newString = str
   }else{  
     newString = `${str}s`
   }
   return newString
 }
 

 getChannelId = (userId) => {
   const currentUserId = this.props.currentUser.uid;
   return userId < currentUserId
     ? `${userId}/${currentUserId}`
     : `${currentUserId}/${userId}`;
 };


 changeChannel = () => {
   const { userInView } = this.props
   const privateChannelId = this.getChannelId(userInView.id); 
   const { privateMessagesIdRef } = this.state

   privateMessagesIdRef.on("value", (collection_data) => {
    const existingPrivateUsersIds = collection_data.val();
    
    if(existingPrivateUsersIds){
      if (existingPrivateUsersIds.includes(privateChannelId) === false) {
        existingPrivateUsersIds.push(privateChannelId);
        privateMessagesIdRef.update(existingPrivateUsersIds)
      }
    }
    else{
        const privateMessagesIds = [privateChannelId]
        privateMessagesIdRef.update(privateMessagesIds);
    }
    
   });

   const channelData = {
     id: privateChannelId,
     dm_id: userInView.id,
     name: userInView.name,
   };

   this.props.setCurrentChannel(channelData);
   this.props.setPrivateChannel(true);
  
   if(this.props.isDesktop){
    this.props.setDMFinalVerifyTop();
    this.props.dmCheckSetterDesktop();
    setTimeout(() => this.props.remountComponent(), 1000);
   }else{
     this.props.verifyCrooner();
   }
 };


 linkMeToUserInView = (currentUser, userInList) => {
   const { messagesRef, uniqueUsersRef } = this.state
   let child1 = ""
   let child2 = ""
   let messages = []

   if(currentUser && userInList) {
     const currentUserId = currentUser.uid
     const userInListId = userInList.id

     if(currentUserId < userInListId) {
       child1 = currentUserId
       child2 = userInListId
     }else {
       child1 = userInListId
       child2 = currentUserId
     }

     messagesRef
       .child(child1)
       .child(child2)
       .once("value", (snap) => {
          const snapData = snap.val()
          messages.push(snapData)
          const msgsArray = messages.reduce((accumulator, data) => {
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
          
          // Run this if there is a database record of messages exchanged by both users.
          if(msgsArray.length > 0) {
            uniqueUsersRef.once("value", (snap) => {
              const data = snap.val();
              if(data !== null) {
                if(data[userInListId] !== undefined) {
                  const suscribedUsersIdAlt = data[userInListId].suscribedUsersId;
                  suscribedUsersIdAlt.push(currentUserId);
                  uniqueUsersRef
                    .child(`${userInListId}/suscribedUsersId`)
                    .update(
                      suscribedUsersIdAlt
                    );
                }

              }

            })
          }

       })
   }
 }


 // Please reference the logic here to remove users from channel.
 // Reference this to delete chat in DMs.
 chatMe = () => {
   const currentUserId = this.props.currentUser.uid;
   const { uniqueUsersRef } = this.state
   const { userInView, currentUser } = this.props

   const suscribedUsers = {
       suscribedUsersId: [userInView.id]
   }

   uniqueUsersRef.once("value", (snap) => {
     const data = snap.val();
     if(data !== null) {
       let available_ids = Object.keys(data);
       if (available_ids.includes(currentUserId)) {
         const suscribedUsersId = data[currentUserId].suscribedUsersId;
         if (suscribedUsersId.includes(userInView.id) === false) {
           suscribedUsersId.push(userInView.id);
           uniqueUsersRef
             .child(`${currentUserId}/suscribedUsersId`)
             .update(
             suscribedUsersId
             );
          this.linkMeToUserInView(currentUser, userInView)
         }
       }else {
         uniqueUsersRef
          .child(currentUserId)
          .update(suscribedUsers)
       }
     }else{
       uniqueUsersRef
        .child(currentUserId)
        .set(suscribedUsers)
     }
   });
   
   this.changeChannel();
 };

 setInactive = () => {
   const { isPrivateChannel } = this.props
   if(isPrivateChannel) {
     return true
   }
   return false
 }
  



  render() {
    const { channelCount, starCount, hamModalTracker, showEditDiv, userInfo, isOpen, online_pc_status } = this.state;
    const {
      goBack,
      groupCheckSetter,
      dmCheckSetter,
      userInView,
      onlineDectectorById
    } = this.props;


    return (
      <>
         {
           isOpen && userInfo.avatar &&  (
           <Lightbox
             mainSrc={userInfo.avatar}
             onCloseRequest={() => this.setState({ isOpen: false })}
             enableZoom={false}
             imageTitle={userInView && userInView.name }
             imageCaption={`${channelCount} ${this.singularitySuffix(channelCount, "channel")}  ${starCount} ${this.singularitySuffix(starCount, "star")}`}
           />
         )
         }

        {hamModalTracker ? (
          <ProfileHamburgerModal
            goBack={this.removeHamModal}
            groupCheckSetter={groupCheckSetter}
            dmCheckSetter={dmCheckSetter}
            removeHamModal={goBack}
            showEditDiv={showEditDiv}
            ref={this.profileRef}
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
                  {shortenFileName(capitalizeFirstLetter(userInView.name), 10, 0.99, "...")}
                </p>
              </div>
            </div>
            <div className="channel-nav--2" onClick={this.addHamModal}>
              <img src={hamburgerCustom} className="hamburger" alt="" />
            </div>
          </div>

          <BlackRock className="profile place-on-top">
            {userInView ? (
              <div className="profile--image profile--imageAlt image_pa" onClick={ () => this.openLightBox()} >
                <img
                  src={userInfo.avatar? userInfo.avatar: loading_svg}
                  alt=""
                  className="profile--imageItem"
                  onLoad={() => this.displayOnlineStatus()}
                />
                <span>
                  <MdZoomOutMap className="profile--camera" />
                </span>
                {online_pc_status && 
                  <span className={`image_pa--online-status 
                                    ${onlineDectectorById(userInView.id) === "online" 
                                    ? "green--online": "orange--offline" }`}>
                     
                  </span>
                }
              </div>
            ) : (
              <div className="profile--imageItem">
                <Skeleton circle={true} height={96} width={96} />
              </div>
            )}

            <div className="place-center middlelize push_about_down sleek_bkgrd">
              <ManeteeSpan as="div" className="profile--about descr_top">
               About
               <span className= "descr_underliner2"></span>
              </ManeteeSpan>
              <div className="profile--flex column_flexer">
                <ProfileContent className="profile--aboutItem profile--aboutItem2 profile--aboutItem2_pa profile--break padd-up2">
                  {userInfo.about === undefined?
                    <Skeleton count={4} />
                   :
                    userInfo.about.details
                  }
                </ProfileContent>
                <div className="profile_about_time profile_about_time_pa">
                  {userInfo.about === undefined?
                    <Skeleton count={1} />
                   :
                   <ProfileContent as="span">
                     {capitalizeFirstLetter(userInView.name)}&nbsp;~&nbsp;
                     {this.iFormatDate(userInfo.about.timeUpdated)}&nbsp;|&nbsp;
                     <span className={onlineDectectorById(userInView.id) === "online"?"themefy-uppercase":""}>
                       {onlineDectectorById(userInView.id) !== "online" && "Last seen "}{onlineDectectorById(userInView.id)}
                     </span>
                   </ProfileContent>
                  }
                </div>
              </div>
            </div>

            <div className="profile--stats profile--push-down profile--push-down2">
              <div className="profile--channels">
                <ManeteeSpan as="div" className="profile--channels__header">Channels</ManeteeSpan>
                <div className="profile--channels__number">{channelCount}</div>
              </div>
              <div className="profile--messages">
                <ManeteeSpan as="div" className="profile--messages__header">Joined</ManeteeSpan>
                <div className="profile--messages__number">
                  {userInfo.userRawData === undefined?
                    <Skeleton count={1} />
                   :
                    this.formatDate(userInfo.userRawData.creationTime)
                  }
                </div>
              </div>
              <div className="profile--seen">
                <ManeteeSpan as="div" className="profile--seen__header">Stars</ManeteeSpan>
                <div className="profile--seen__number">{starCount}</div>
              </div>
            </div>

            { !this.props.isPrivateChannel &&
            <div className="profile_alt_1">
              <ButtonColor className={`profile_alt_1--btn ${this.setInactive() && "inactive_btn"}`} onClick={() => this.chatMe()}>
                <MdChatBubble className="profile_alt_1--svg" />
                <span  className="profile_alt_1--text">
                  Secret chat
                </span>
               
              </ButtonColor>
            </div>
            }
          </BlackRock>

        </BlueCharcoalExtended>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userInView: state.userInView.currentUserInView,
  currentUser: state.user.currentUser,
  isPrivateChannel: state.channel.isPrivateChannel
});


export default connect(mapStateToProps, { setActiveComponent, setCurrentChannel, setPrivateChannel })(ProfileAlt);