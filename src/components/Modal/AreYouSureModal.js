import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "../../firebase";
import AreYouSureModalDesktop from "./AreYouSureModalDesktop.js"



class AreYouSureModal extends Component {
  state = {
    channelsRef: firebase.database().ref("channels"),
    uniqueUsersRef: firebase.database().ref("unique_id_of_users"),
    usersRef: firebase.database().ref("users"),
  };
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.classList.add('disable-scroll');
    this.props.removeHamModal();
  }

  componentWillUnmount() {
    document.body.classList.remove('disable-scroll');
  }

  removeYourselfFromChannel = () => {
    const { channelsRef, usersRef } = this.state;
    const { currentUser, currentChannel } = this.props;
    if (currentUser && currentChannel) {
      let currentChannelID = currentChannel.id;
      let username = `${currentUser.displayName}_${currentUser.uid}`;

      channelsRef
        .child(`${currentChannelID}/suscribed_users/users_id`)
        .once("value", (data) => {
          const ids = data.val();
          if (ids !== null) {
            if (ids.includes(currentUser.uid)) {
              const id_index = ids.indexOf(currentUser.uid);
              if (id_index !== -1) {
                const specificId = ids.splice(id_index, 1);
                const newIds = ids.filter((item) => item !== specificId[0]);
                channelsRef
                  .child(`${currentChannelID}/suscribed_users/users_id`)
                  .set(newIds);
              }
            }
          }
        });


      channelsRef
         .child(`${currentChannelID}/suscribed_users/users_name`)
         .once("value", (data) => {
           const userNames = data.val();
           if (userNames !== null) {
             if (userNames.includes(username)) {
               const id_index = userNames.indexOf(username);
               if (id_index !== -1) {
                 const specificId = userNames.splice(id_index, 1);
                 const newuserNames = userNames.filter((item) => item !== specificId[0]);
                 channelsRef
                   .child(`${currentChannelID}/suscribed_users/users_name`)
                   .set(newuserNames);
               }
             }
           }
         });


      usersRef
        .child(`${currentUser.uid}/pinned`)
        .child(currentChannelID)
        .once("value", (snap) => {
          const data = snap.val();
          if(data !== null) {
            usersRef
              .child(`${currentUser.uid}/pinned`)
              .child(currentChannelID)
              .remove((err) => {
                if (err !== null) {
                  console.error(err);
                }
              });
          }
        });
      this.setState(
        (previousState) => ({
          areYouSureTracker: false,
        }),
        () => !this.props.isDesktop?this.props.groupCheckSetter():this.props.remountSetChannel()
      );
    }
  };

  removeSomeoneFromChat = () => {
    const currentUserId = this.props.currentUser.uid;
    const { uniqueUsersRef } = this.state
    const { userInView } = this.props

    uniqueUsersRef.once("value", (snap) => {
      const data = snap.val();
      if(data !== null) {
        let available_ids = Object.keys(data);
        if (available_ids.includes(currentUserId)) {
          const suscribedUsersId = data[currentUserId].suscribedUsersId;
          if (suscribedUsersId.includes(userInView)) {
            const id_index = suscribedUsersId.indexOf(userInView);
            if (id_index !== -1) {
              const specificId = suscribedUsersId.splice(id_index, 1);
              const newIds = suscribedUsersId.filter((item) => item !== specificId[0]);
              uniqueUsersRef
                .child(`${currentUserId}/suscribedUsersId`)
                .set(newIds);
            }
          }
        }
      }
    });

    this.setState(
      (previousState) => ({
        areYouSureTracker: false,
      }),
      () => !this.props.isDesktop?this.props.dmCheckSetter():this.props.remountSetChannel()
    );
  };


  render() {
    const {
      channelName,
      hideAYSModal,
      isAdmin,
      deleteChannelAsAdmin,
      isPrivateChannel,
      isDesktop,
      currentUser,
      areYouSureTracker,
    } = this.props;
    return !isDesktop ? (
      <>
        <div
          className="add-about--darkLayer  ays--darkLayer"
          onClick={hideAYSModal}
        ></div>

        <div className={`add-about add-about-middle ${isPrivateChannel ? "add-about-middle-pc": "add-about-middle-ch"}`} >
          <div>
            <div className="add-about--title ays-text">Are You Sure?</div>
            <div className="accept_ignore--instructions ays-instruct">
              <div className="accept_ignore--text ays--text2 ays--text2b" >
                This operation cannot be undone. Clicking "continue"&nbsp;
                {isPrivateChannel?
                  <span>
                    removes <em>{channelName}</em> from your DMs Tab. 
                    Please, be careful while deleting a chat because 
                    <span className="redify"> you cannot access this user anymore</span> until you initialize a new
                     connection from your end. We take <span className="redify">Two-Way
                    connection</span> seriously for security purposes
                  </span>
                 :
                  isAdmin ? (
                  <span>
                    deletes the channel (<em>{channelName}</em>) completely{" "}
                  </span>
                ) : (
                  <span>
                    removes you from <em>{channelName}</em> channel
                  </span>
                )    
                }
                , do you intend to proceed?
              </div>
            </div>
            <div className="add-about--form ays-btns">
              <div className="add-about--btns">
                <button onClick={hideAYSModal}>Cancel</button>
                <button
                  className="ays-btns--continue ays-btns--continue_pc"
                  onClick={
                    isPrivateChannel?
                        () => this.removeSomeoneFromChat()
                    :
                    isAdmin
                      ? deleteChannelAsAdmin
                      : () => this.removeYourselfFromChannel()
                  }
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    ):
    <AreYouSureModalDesktop
       channelName={channelName}
       hideAYSModal={hideAYSModal}
       deleteChannelAsAdmin={deleteChannelAsAdmin}
       isAdmin={isAdmin}
       isPrivateChannel={isPrivateChannel}
       currentUser={currentUser}
       isDesktop={isDesktop}
       areYouSureTracker={areYouSureTracker}
       removeSomeoneFromChat={this.removeSomeoneFromChat}
       removeYourselfFromChannel={this.removeYourselfFromChannel}
    />
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
    userInView: state.channel.currentChannel ? state.channel.currentChannel.dm_id : {},
  };
};

export default connect(mapStateToProps, {})(AreYouSureModal);
