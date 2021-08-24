import React, { Component } from "react";
import { HiPhotograph } from "react-icons/hi";
import { RiCheckFill } from "react-icons/ri";
import { connect } from "react-redux";
import { shortenFileName } from "../Utility/string_shortener";
import Sidebar from "./Sidebar";
import PrivateChatContainer from "./PrivateChatContainer";
import firebase from "../../firebase";
import {
  setCurrentChannel,
  setPrivateChannel,
  setOnlineStatus,
  setNotification,
  setUserCurrentlyInView,
  setActiveComponent
} from "../../actions";
import moment from "moment";
import Cookies from 'js-cookie'
import { statusObject } from "../Utility/statusOptions";





class PrivateChatList extends Component {
  state = {
    // activeChannel: '',
    user: this.props.currentUser,
    all_users: [],
    users: [],
    usersRef: firebase.database().ref("users"),
    uniqueUsersRef: firebase.database().ref("unique_id_of_users"),
    presenceRef: firebase.database().ref("presence"),
    lastOnlineRef: firebase.database().ref("lastOnlinePresence"),
    messagesRef: firebase.database().ref("messages"),
    privateMessagesIdRef: firebase.database().ref("privateMessagesIds"),
    onlineStatus: false,
    privateChatNotifications: this.props.allNotifications,
    online_pc_status: false
  };


 componentDidUpdate(prevProps, prevState) {
   const props = this.props;
   if (prevProps !== props) {
     const newNotification = this.state.privateChatNotifications
     let new_data = newNotification.filter(item => item.count > 0)
     

     if(new_data.length > 0){
       Cookies.set("private_msg", newNotification, { expires: 365 })
     }
     else{  
       const serializedNotiCookie = () => {
         return JSON.parse(Cookies.get("private_msg"))
       }
       if(Cookies.get("private_msg") === undefined){
         return;
       }else{
         this.setState({
           privateChatNotifications: serializedNotiCookie()
         })
       }

     }

   }
 }

  getNotificationCount = chatUser => {
    // This chatUSer is not me but people I chat with!
    let count = 0;
    let me = this.props.currentUser
    let other_person = chatUser

    let me_id = me.uid
    let other_person_id = other_person.uid

    var id_of_interest; 
   

    if(other_person_id < me_id){
      id_of_interest = `${other_person_id}/${me_id}`;
    }else{
      id_of_interest = `${me_id}/${other_person_id}`;
    }
    
    if(this.state.privateChatNotifications){
      this.state.privateChatNotifications.forEach(notification => {
        if (notification.id === id_of_interest) {
          count = notification.count;
        }
      });
    }

    if (count > 0) return count;
  };




  componentDidMount() {
    const user = this.state.user;
    if (user) {
      this.addListeners(this.state.user.uid);
      const newObj = {
        ...statusObject,
        dmCheckTrack: true
      }
      this.props.setActiveComponent(newObj);
    }

    this.setState({
      privateChatNotifications: this.props.allNotifications
    })


  }
  

   showOnlySuscribedUsers = (loadedUsers) => {
     const currentUserId = this.props.currentUser.uid;
     const { uniqueUsersRef } = this.state
     if(loadedUsers.length > 0) {
       uniqueUsersRef.on("value", (snap) => {
         const data = snap.val();
         if(data !== null) {
           let available_ids = Object.keys(data);
           if (available_ids.includes(currentUserId)) {
             const suscribedUsersId = data[currentUserId].suscribedUsersId;
             const filtered = loadedUsers.filter(item => suscribedUsersId.includes(item.uid))
             this.setState({
               users: filtered
             })
           }
         }
       });
     }
   }



  addListeners = (currentUserUid) => {
    let loadedUsers = [];
    const { usersRef, presenceRef, lastOnlineRef, privateMessagesIdRef } = this.state;

    usersRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);


        this.setState({ all_users: loadedUsers }, () => this.showOnlySuscribedUsers(loadedUsers));
      }
    });

    presenceRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    presenceRef.on("child_removed", (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });

    lastOnlineRef.on("value", (snap) => {
      if (snap.val()) {
        const last_seen_user_object = snap.val();
        this.props.setOnlineStatus(last_seen_user_object);
      }
    });

    privateMessagesIdRef
    .on("child_added", snap => {
      // This key was already stored in the database as 
      // Array (PrivateChatList component).
      this.addPrivateNotificationListener(snap.val()) 
    })


  };

 

 addPrivateNotificationListener = (channelId) => {
   this.state.messagesRef.child(channelId).on("value", (snap) => {
     this.handlePrivateNotifications(channelId, this.state.privateChatNotifications, snap);
   });
 }



 handlePrivateNotifications = (channelId, privateChatNotifications, snap) => {
   let lastTotal = 0;
 
   let index = privateChatNotifications.findIndex(
     (notification) => notification.id === channelId
   );

   if (index !== -1) {
     if (channelId) {
       lastTotal = privateChatNotifications[index].total;
       if (snap.numChildren() - lastTotal > 0) {
         privateChatNotifications[index].count = snap.numChildren() - lastTotal;
       }
     }
     privateChatNotifications[index].lastKnownTotal = snap.numChildren();
   } else {
       privateChatNotifications.push({
         id: channelId,
         total: snap.numChildren(),
         lastKnownTotal: snap.numChildren(),
         count: 0,
       });
   }

   this.props.setNotification(privateChatNotifications)
   this.setState({ privateChatNotifications });
   
 };




  onlineDectectorById = (userListId) => {
    var status = moment(this.userPresenceCheckTest(userListId)).calendar()
    let presence_object = this.props.onlineLive;
    if(presence_object){
      let all_online_ids = Object.keys(presence_object);     
      if (all_online_ids.length) {
        all_online_ids.map((id) => {
          if (id.includes(userListId)) {
            status = "online"
          }
           return status;
        });
      }
    }

    return status
  };

  isUserOnline = (user) => user.status === "online";

  userPresenceCheckTest = (currentUserUid) => {
    const online = [];
    const onlineStatStore = this.props.onlineStatusObject;
    if(onlineStatStore){
      const idArray = Object.keys(onlineStatStore);
      idArray.map((id) => {
        if (currentUserUid === id) {
          let last_seen = onlineStatStore[id].last_seen;
          online.push(last_seen); 
        }
        return online[0];
      })
    }

    return online[0];
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((accumulator, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return accumulator.concat(user);
    }, []);

    this.setState({ users: updatedUsers });
  };

  changeChannel = (user) => {
    const privateChannelId = this.getChannelId(user.uid); 
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
      dm_id: user.uid,
      name: user.name,
    };

    const userInView = {
      id: user.uid,
      name: user.name,
    }



    this.props.setCurrentChannel(channelData);
    this.props.setUserCurrentlyInView(userInView);
    this.props.setPrivateChannel(true);
    this.props.verifyCrooner();
    // this.props.verifyCrooner();
    

  };


  getChannelId = (userId) => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };


  getLastMessageFromChannel = (currentUser, userInList) => {
    const { messagesRef } = this.state;
    const user = this.props.currentUser

    let child1 = ""
    let child2 = ""

    let activity = "";
    let timestamp = "";
    let snapData = [];
    let lastMsgData = {}

    const currentUserId = currentUser.uid
    const userInListId = userInList.uid

    if(currentUserId < userInListId) {
      child1 = currentUserId
      child2 = userInListId
    }else {
      child1 = userInListId
      child2 = currentUserId

    }

    if (user) {
      messagesRef
        .child(child1)
        .child(child2)
        .once("value", (snap) => {
        snapData.push(snap.val());
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

        if (msgsArray) {
          const lastMsg = msgsArray[msgsArray.length - 1];
          if(lastMsg) {
            lastMsgData = lastMsg
            const fullDetail = `${lastMsg.content}`;
            timestamp = lastMsg.timestamp
            if (lastMsg.content) {
             if (user.uid === lastMsg.user.id) {
               activity = (
                 <span className="make_flex">
                   <RiCheckFill className="one_remer" />{" "}
                   {shortenFileName(fullDetail, 35, 0.99, "...")}
                 </span>
               )
             } else {
               activity = (
                 <span>{shortenFileName(fullDetail, 35, 0.99, "...")}</span>
               );
             }
            } else {
              if (user.uid === lastMsg.user.id) {
                activity = (
                  <span className="photo_icon">
                    <RiCheckFill className="one_remer" />{" "}
                    <HiPhotograph className="photo_icon_item" />
                    <span className="photo_icon_item_2">Photo</span>{" "}
                  </span>
                );
              } else {
                activity = (
                  <span>
                    <span className="photo_icon">
                      <HiPhotograph className="photo_icon_item" />
                      <span className="photo_icon_item_2">Photo</span>{" "}
                    </span>
                  </span>
                );
              }
            }
          }

        }
      });
    }
    const data = {
      activity,
      timestamp,
      lastMsgData
    }
    return data;
  };


  moreThanThreeCount = count => {
    let new_count = ""
    if(count.length >= 3) {
      new_count = "noti_three"
    }
    return new_count
  }

  displayOnlineStatus = () => {
    this.setState({
      online_pc_status: true
    })
  }


  componentWillUnmount() {
    this.removeListeners();
    const newObj = {
      ...statusObject,
      dmCheckTrack: false
    }
    this.props.setActiveComponent(newObj);
    this.setState = (state, callback)=>{
        return;
    };
  }

  removeListeners = () => {
    this.state.usersRef.off();
    this.state.presenceRef.off();
    this.state.lastOnlineRef.off();

  };


  render() {
    const {
      sidebar,
      sidebarSwitcher,
      sidebarSwitcherReverse,
      dmCheckSetter,
      groupCheckSetter,
      profileCheckSetter,
      starCheckSetter,
      currentUser,
      dmCheckDesktop
    } = this.props;

    const { users, online_pc_status } = this.state;

    return (
      <>
        {sidebar && !dmCheckDesktop ? (
          <Sidebar
            sidebarSwitcherReverse={sidebarSwitcherReverse}
            dmCheckSetter={dmCheckSetter}
            groupCheckSetter={groupCheckSetter}
            profileCheckSetter={profileCheckSetter}
            starCheckSetter={starCheckSetter}
          />
        ) : (
          ""
        )}
        <PrivateChatContainer  
          users={users}
          changeChannel = {this.changeChannel}
          displayOnlineStatus = {this.displayOnlineStatus}
          onlineDectectorById = {this.onlineDectectorById}
          getLastMessageFromChannel = {this.getLastMessageFromChannel}
          sidebarSwitcher={sidebarSwitcher}
          getNotificationCount={this.getNotificationCount}
          moreThanThreeCount={this.moreThanThreeCount}
          groupCheckSetter={groupCheckSetter}
          currentUser={currentUser}
          online_pc_status={online_pc_status}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    onlineStatusObject: state.channel.onlineStatus,
    currentChannel: state.channel.currentChannel,
    onlineLive: state.channel.onlineLive,
    allNotifications: state.channel.notifications
  };
};

export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel,
  setOnlineStatus,
  setNotification,
  setActiveComponent,
  setUserCurrentlyInView
})(PrivateChatList);



