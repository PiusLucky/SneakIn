import React, { Component } from "react";
import firebase from "../../firebase";
import moment from "moment";
import { successMsg, errorMsg } from "../Utility/animate";
import ChannelModal from "../Modal/ChannelModal";
import { scrollTop } from "../Utility/scroll_top";
import {
  setCurrentChannel,
  setPrivateChannel,
  setActiveComponent,
  setUserCurrentlyInView,
  setUsersAvatarPair
} from "../../actions";
import { HiPhotograph } from "react-icons/hi";
import { connect } from "react-redux";
import ChannelChat from "./ChannelChat";
import { withRouter } from "react-router";
import AcceptIgnore from "../Modal/AcceptIgnore";
import ChannelList from "./ChannelList";
import Profile from "./Profile";
import ProfileAlt from "./ProfileAlt";
import StarredMsgs from "./StarredMessages";
import PrivateChatList from "./PrivateChatList";
import BottomNav from "./BottomNav";
import ProfileImage from "./ProfileImage";
import About from "../About";
import Cookies from "js-cookie";
import { shortenFileName } from "../Utility/string_shortener";
import { capitalizeFirstLetter } from "../Utility/capitalizeFirstLetter";
import { RiCheckFill } from "react-icons/ri";
import loading_svg from "../../static/img/loading/loading.svg";
import ChannelParentThemefy from "../Themefy/ChannelParentThemefy"
import { ManeteeSpan } from "../Themefy/ManateeColor";
import Preloader from "../Preloader";


const ModalAnimate = ({
  verify,
  acceptChannel,
  ignoreChannel,
  currentUser,
  currentChannel,
  verifyCrooner,
}) => {
  return (
    <div className="accept_ignore_modal">
      <AcceptIgnore
        accept={acceptChannel}
        ignore={ignoreChannel}
        currentUser={currentUser}
        currentChannel={currentChannel}
        verifyCrooner={verifyCrooner}
      />
    </div>
  );
};

class Channel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserID: [],
      channels: [],
      user: this.props.currentUser,
      currentChannel: this.props.currentChannel,
      error: "",
      modal: false,
      loading: false,
      channelName: "",
      channelDetails: "",
      channel: null,
      channelsRef: firebase.database().ref("channels"),
      messagesRef: firebase.database().ref("messages"),
      usersRef: firebase.database().ref("users"),
      privateMessagesIdRef: firebase.database().ref("privateMessagesIds"),
      uniqueUsersRef: firebase.database().ref("unique_id_of_users"),
      notifications: [],
      messages: [],
      redirect: false,
      firstLoad: true,
      verify: false,
      verifyDesktop: false,
      ignore: false,
      accept: false,
      groupCheck: true,
      profileCheck: false,
      dmCheck: false,
      sidebar: false,
      starCheck: false,
      aboutCheck: false,
      displayBottomNav: true,
      displayProfileImage: false,
      homeIconState: true,
      dmIconState: false,
      starIconState: false,
      youIconState: false,
      lastChannelMessage: null,
      profileAltCheck: false,
      cCMounted: true,
      childKey: Math.random(),
      newChankey: Math.random(),
      pinnedKey: `${Math.random()}_pinned`,
      unpinnedKey: `${Math.random()}_unpinned`,
      isAIModal: false,
      isUserVerifiedTop: false,
      isCLModal: false,
      channelSubscriptionPair: [],
      lastMessagePair: [],
      unPinnedChannels: [],
      pinnedChannels: [],
      byepassVrfOnMount: false,
      dmCheckDesktop: false,
      starCheckDesktop: false,
      users: [],
      all_users: [],
      online_pc_status: false,
      DMFinalVerifyTop: false,
      keyOfKeyPairs: [],
      profileAltKey: Math.random(),
      groupInfoKey: Math.random(),
      userAvatarPair: [],
      isPreloading: true,
    };

    this.homeRef = React.createRef();
    this.dmRef = React.createRef();
    this.starRef = React.createRef();
    this.youRef = React.createRef();
    this.bnRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const props = this.props;
    let user = props.currentUser;
    if (prevProps !== props) {
      if (user) {
        this.setState({
          user: this.props.currentUser,
        });
        const newNotification = this.state.notifications;
        let new_data = newNotification.filter((item) => item.count > 0);

        if (new_data.length > 0) {
          Cookies.set(user.uid, newNotification, { expires: 365 });
        } else {
          const serializedNotiCookie = () => {
            return JSON.parse(Cookies.get(user.uid));
          };
          if (Cookies.get(user.uid) === undefined) {
            return;
          } else {
            this.setState({
              notifications: serializedNotiCookie(),
            });
          }
        }
      }
    }
  }

  componentDidMount() {
    this.addListeners();
  }

  // START => DM functionalities

  activateAddListeners = () => {
    let loadedUsers = [];
    const { usersRef } = this.state;
    const currentUser = this.props.currentUser
    if(currentUser) {
      const currentUserUid = this.props.currentUser.uid;
      usersRef.on("child_added", (snap) => {
        if (currentUserUid !== snap.key) {
          let user = snap.val();
          user["uid"] = snap.key;
          user["status"] = "offline";
          loadedUsers.push(user);
          this.setState({ all_users: loadedUsers }, () =>
            this.showOnlySuscribedUsers(loadedUsers)
          );
        }
      });
    }

  };

  remountProfileComponent = () => {
    this.setState({
      profileAltKey: Math.random()
    })
  };

  remountGIComponent = () => {
    this.setState({
      groupInfoKey: Math.random()
    })
  }


  showOnlySuscribedUsers = (loadedUsers) => {
    const currentUserId = this.props.currentUser.uid;
    const { uniqueUsersRef } = this.state;
    if (loadedUsers.length > 0) {
      uniqueUsersRef.on("value", (snap) => {
        const data = snap.val();
        if (data !== null) {
          let available_ids = Object.keys(data);
          if (available_ids.includes(currentUserId)) {
            const suscribedUsersId = data[currentUserId].suscribedUsersId;
            const filtered = loadedUsers.filter((item) =>
              suscribedUsersId.includes(item.uid)
            );
            this.setState({
              users: filtered,
            });
          }
        }
      });
    }
  };

  displayOnlineStatus = () => {
    this.setState({
      online_pc_status: true,
    });
  };

  onlineDectectorById = (userListId) => {
    var status = moment(this.userPresenceCheckTest(userListId)).calendar();
    let presence_object = this.props.onlineLive;
    if (presence_object) {
      let all_online_ids = Object.keys(presence_object);
      if (all_online_ids.length) {
        all_online_ids.map((id) => {
          if (id.includes(userListId)) {
            status = "online";
          }
          return status;
        });
      }
    }

    return status;
  };

  userPresenceCheckTest = (currentUserUid) => {
    const online = [];
    const onlineStatStore = this.props.onlineStatusObject;
    if (onlineStatStore) {
      const idArray = Object.keys(onlineStatStore);
      idArray.map((id) => {
        if (currentUserUid === id) {
          let last_seen = onlineStatStore[id].last_seen;
          online.push(last_seen);
        }
        return online[0];
      });
    }

    return online[0];
  };

  getNotificationCount = (chatUser) => {
    // This chatUSer is not me but people I chat with!
    let count = 0;
    let me = this.props.currentUser;
    let other_person = chatUser;

    let me_id = me.uid;
    let other_person_id = other_person.uid;

    var id_of_interest;

    if (other_person_id < me_id) {
      id_of_interest = `${other_person_id}/${me_id}`;
    } else {
      id_of_interest = `${me_id}/${other_person_id}`;
    }

    if (this.state.privateChatNotifications) {
      this.state.privateChatNotifications.forEach((notification) => {
        if (notification.id === id_of_interest) {
          count = notification.count;
        }
      });
    }

    if (count > 0) return count;
  };

  moreThanThreeCount = (count) => {
    let new_count = "";
    if (count.length >= 3) {
      new_count = "noti_three";
    }
    return new_count;
  };

  getChannelId = (userId) => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  changePrivateChannelDesktop = (user) => {
    const privateChannelId = this.getChannelId(user.uid);
    const { privateMessagesIdRef } = this.state;

    privateMessagesIdRef.on("value", (collection_data) => {
      const existingPrivateUsersIds = collection_data.val();

      if (existingPrivateUsersIds) {
        if (existingPrivateUsersIds.includes(privateChannelId) === false) {
          existingPrivateUsersIds.push(privateChannelId);
          privateMessagesIdRef.update(existingPrivateUsersIds);
        }
      } else {
        const privateMessagesIds = [privateChannelId];
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
    };

    this.props.setCurrentChannel(channelData);
    this.props.setUserCurrentlyInView(userInView);
    this.props.setPrivateChannel(true);
    this.setState({ verifyDesktop: true, DMFinalVerifyTop: true });
    this.remountComponent();
    this.remountProfileComponent();
  };

  setDMFinalVerifyTop = () => {
    this.setState({
      DMFinalVerifyTop: true
    })
  }

  getLastMessageFromPrivateUser = (currentUser, userInList) => {
    const { messagesRef } = this.state;
    const user = this.props.currentUser;

    let child1 = "";
    let child2 = "";

    let activity = "";
    let timestamp = "";
    let snapData = [];
    let lastMsgData = {};

    const currentUserId = currentUser.uid;
    const userInListId = userInList.uid;

    if (currentUserId < userInListId) {
      child1 = currentUserId;
      child2 = userInListId;
    } else {
      child1 = userInListId;
      child2 = currentUserId;
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
            if (lastMsg) {
              lastMsgData = lastMsg;
              const fullDetail = `${lastMsg.content}`;
              timestamp = lastMsg.timestamp;
              if (lastMsg.content) {
                if (user.uid === lastMsg.user.id) {
                  activity = (
                    <ManeteeSpan className="make_flex">
                      <RiCheckFill className="one_remer" />{" "}
                      {shortenFileName(fullDetail, 35, 0.99, "...")}
                    </ManeteeSpan>
                  );
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
      lastMsgData,
    };
    return data;
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

  generateLastMsgPairPrivate = (currentUser, userInList) => {
    const { messagesRef } = this.state;
    const snapData = [];
    let result = {
      message: "@Bot_Helper -- Start a conversation!",
    };

    let child1 = "";
    let child2 = "";

    if (currentUser && userInList) {
      const currentUserId = currentUser.uid;
      const userInListId = userInList.uid;

      if (currentUserId < userInListId) {
        child1 = currentUserId;
        child2 = userInListId;
      } else {
        child1 = userInListId;
        child2 = currentUserId;
      }

      messagesRef
        .child(child1)
        .child(child2)
        .once("value", (snapshot) => {
          snapData.push(snapshot.val());
          const msgsArray = snapData.reduce((accumulator, data) => {
            accumulator.push(data);
            if (accumulator[0]) {
              const msgObj = accumulator[0];
              const msgObjKey = Object.keys(msgObj);
              const msgArrayObject = msgObjKey.map((key) => {
                const objItem = msgObj[key];
                return objItem;
              });

              const lastItem = msgArrayObject[msgArrayObject.length - 1];
              if (lastItem) {
                const makePair = () => {
                  const pair = {
                    path1: child1,
                    path2: child2,
                    channel_id: `${child1}/${child2}`,
                    timestamp: this.timestampFormatter(lastItem.timestamp),
                    type: lastItem.image ? "image" : "content",
                    message: this.lastMsgsRefiner(lastItem),
                    sender: {
                      name: lastItem.user.name,
                      id: lastItem.user.id,
                    },
                  }
                  result = pair
                  return pair;
                };
                accumulator = makePair();
              }
            }
            return accumulator;
          }, []);
          return msgsArray;
        });

    }

    return result
  };



  // END => DM functionalities

  CLModalReverse = () => {
    this.setState((prevState) => ({
      isCLModal: !prevState.isCLModal,
    }));
  };

  removeError = () => {
    this.setState({
      error: "",
    });
  };

  openModal = () => {
    this.setState({
      ...this.state,
      displayBottomNav: false,
      modal: true,
    });
  };

  setBottomNavInactive = () => {
    this.setState({
      displayBottomNav: false,
    });
  };

  setBottomNavActive = () => {
    this.setState({
      displayBottomNav: true,
    });
  };

  setProfileImageActive = () => {
    this.setState({
      displayProfileImage: true,
    });
  };

  setProfileImageInactive = () => {
    this.setState({
      displayProfileImage: false,
    });
  };

  groupCheckSetterDesktop = () => {
    this.setState({
      redirect: false,
      sidebar: true,
      groupCheck: true,
      dmCheck: false,
      profileCheck: false,
      starCheck: false,
      aboutCheck: false,
      displayProfileImage: false,
      profileAltCheck: false,
      dmCheckDesktop: false,
      starCheckDesktop: false
    });
  };

  // advanceGroupSetterDesktop =() => {
  //   this.setState({
  //     redirect: false,
  //     sidebar: true,
  //     groupCheck: true,
  //     dmCheck: false,
  //     profileCheck: false,
  //     starCheck: false,
  //     aboutCheck: false,
  //     displayProfileImage: false,
  //     profileAltCheck: false,
  //     dmCheckDesktop: false,
  //     starCheckDesktop: false
  //   });
  // }

  starCheckSetterDesktop = () => {
    this.setState({
      redirect: false,
      sidebar: true,
      groupCheck: true,
      dmCheck: false,
      profileCheck: false,
      starCheck: false,
      aboutCheck: false,
      displayProfileImage: false,
      profileAltCheck: false,
      dmCheckDesktop: false,
      starCheckDesktop: true
    });
  };

  dmCheckSetterDesktop = () => {
    this.activateAddListeners();
    this.setState({
      redirect: false,
      sidebar: true,
      groupCheck: true,
      dmCheck: false,
      profileCheck: false,
      starCheck: false,
      aboutCheck: false,
      displayProfileImage: false,
      profileAltCheck: false,
      dmCheckDesktop: true,
      starCheckDesktop: false
    });

  };

  groupCheckSetter = () => {
    this.setState({
      redirect: false,
      sidebar: false,
      groupCheck: true,
      dmCheck: false,
      profileCheck: false,
      starCheck: false,
      aboutCheck: false,
      displayProfileImage: false,
      profileAltCheck: false,
    });
  };

  groupCheckSetterV2 = () => {
    this.groupCheckSetter();
    this.remountCLComp()
  }

  profileAltSetter = () => {
    this.setState({
      redirect: false,
      sidebar: false,
      groupCheck: false,
      dmCheck: false,
      profileAltCheck: true,
      profileCheck: false,
      starCheck: false,
      aboutCheck: false,
      displayProfileImage: false,
    });
  };

  profileCheckSetter = () => {
    this.setState({
      redirect: false,
      sidebar: false,
      groupCheck: false,
      dmCheck: false,
      profileCheck: true,
      starCheck: false,
      aboutCheck: false,
      displayProfileImage: false,
      profileAltCheck: false,
    });
  };

  profileImageCheckSetter = () => {
    this.setState({
      redirect: false,
      sidebar: false,
      groupCheck: false,
      dmCheck: false,
      profileCheck: false,
      starCheck: false,
      aboutCheck: false,
      displayProfileImage: true,
      profileAltCheck: false,
    });
  };

  dmCheckSetter = () => {
    this.setState({
      redirect: false,
      sidebar: false,
      dmCheck: true,
      groupCheck: false,
      profileCheck: false,
      starCheck: false,
      aboutCheck: false,
      displayProfileImage: false,
      profileAltCheck: false,
    });
  };

  dmCheckSetterV2 = () => {
    this.dmCheckSetter();
    this.remountComponent()
  }


  chatCheckSetter = () => {
    this.setState({
      redirect: true,
      verify: true,
      sidebar: false,
      dmCheck: false,
      groupCheck: false,
      profileCheck: false,
      starCheck: false,
      aboutCheck: false,
      displayProfileImage: false,
      profileAltCheck: false,
    });
  };

  starCheckSetter = () => {
    this.setState({
      sidebar: false,
      dmCheck: false,
      groupCheck: false,
      profileCheck: false,
      starCheck: true,
      aboutCheck: false,
      displayProfileImage: false,
      profileAltCheck: false,
    });
  };

  aboutCheckSetter = () => {
    this.setState({
      sidebar: false,
      dmCheck: false,
      groupCheck: false,
      profileCheck: false,
      starCheck: false,
      aboutCheck: true,
      displayProfileImage: false,
      profileAltCheck: false,
    });
  };

  sidebarSwitcher = () => {
    this.setState({
      sidebar: true,
    });
  };

  sidebarSwitcherReverse = () => {
    this.setState({
      sidebar: false,
    });
  };

  closeModal = () => {
    this.setState({
      ...this.state,
      displayBottomNav: true,
      modal: false,
      loading: false,
      error: "",
    });
    scrollTop();
  };

  loading_in_progress = () => {
    this.setState({
      ...this.state,
      loading: true,
    });
  };

  generateChannelSubscriptionPair = () => {
    const { channelsRef } = this.state;
    const snapData = [];
    channelsRef.once("value", (snapshot) => {
      snapData.push(snapshot.val());
      const channelsArray = snapData.reduce((accumulator, data) => {
        accumulator.push(data);
        if (accumulator[0]) {
          const msgObj = accumulator[0];
          const msgObjKey = Object.keys(msgObj);
          const msgArrayObject = msgObjKey.map((key) => {
            const objItem = msgObj[key];
            const pair = {
              channel_id: objItem.id,
              subscribers: objItem.suscribed_users && objItem.suscribed_users.users_id,
            };
            return pair;
          });
          accumulator = msgArrayObject;
        }
        return accumulator;
      }, []);
      this.setState({
        channelSubscriptionPair: channelsArray,
      });
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const MAX_CHANNELS_ALLOWED = 9;
    if (this.isFormValid(this.state) && this.isInputValid(this.state)) {
      if (this.state.channels.length <= MAX_CHANNELS_ALLOWED) {
        this.addChannel();
        this.CLModalReverse();
        this.closeModal();
      } else {
        this.setState({
          ...this.state,
          error:
            "Maximum channels exceeded, please subscribe to already existing channels.",
        });
      }
    }

  };

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  isInputValid = ({ channelName, channelDetails }) => {
    const MIN_LENGTH = 5
    if (channelName.length < MIN_LENGTH || channelDetails.length < MIN_LENGTH) {
      this.setState({
        ...this.state,
        error: `Channel name & Channel description
                must exceed five(${MIN_LENGTH}) characters.
               `,
      });
      errorMsg(".channel_error");
      return false;
    } else {
      this.setState({
        ...this.state,
        error: "",
      });
      return true;
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  addChannel = () => {
    this.loading_in_progress();
    const { channelsRef, channelName, channelDetails } = this.state;
    const user = this.props.currentUser;
    const key = channelsRef.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        id: user.uid,
        avatar: user.photoURL,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      },
      suscribed_users: {
        users_id: [user.uid],
        users_name: [`${user.displayName}_${user.uid}`],
      }
    };
    try {
      channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
          this.hasChannelUpdated();
          this.generateChannelSubscriptionPair();

          this.setState({ channelName: "", channelDetails: "" });
        })
        .then(() => {
          this.closeModal();
          this.CLModalReverse();
          successMsg(".success_well");
          this.props.setCurrentChannel(newChannel);
          this.setState({ verifyDesktop: true });
          this.remountComponent(); // remounts ChannelChat Component
          this.newChannelListGenerator();
          this.lastMsgPairGenerator();
        });
    } catch (err) {
      return;
    }
  };

  newChannelListGenerator = () => {
    // Run this.hasChannelUpdated() whenever a channel is added to database
    this.state.channelsRef.on("value", (snap) => {
      this.hasChannelUpdated();
    });
  };

  lastMsgPairGenerator = () => {
    // Generates new lastmessage pairs whenever a message is added to database
    this.state.messagesRef.on("value", (snap) => {
      this.generateLastMsgPair();
      this.generateChannelSubscriptionPair();
    });
  };

  addListeners = () => {
    this.hasChannelUpdated();
    this.generateChannelSubscriptionPair();
    this.generateLastMsgPair();
    this.listenForNotifications();
    this.generateIdAvatarPair();
    // this.listenForClearNotifications();

  };

  unsetVerifyDesktop = () => {
    this.props.setCurrentChannel(null);
  };

  hasChannelUpdated = () => {
    const { channelsRef } = this.state;
    let loadedChannels = [];
    channelsRef.once("value", (snap) => {
      loadedChannels.push(snap.val());
      const msgsArray = loadedChannels.reduce((accumulator, data) => {
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

      this.setState({ channels: msgsArray.reverse(), isPreloading: false }, () =>
        this.reArrangeChannels(msgsArray)
      );
    });
  };

  listenForNotifications = () => {
    this.state.channelsRef.on("child_added", (snap) => {
      this.addNotificationListener(snap.key);
    });
  };

  reArrangeChannels = (msgsArray) => {
    let channels = msgsArray;
    const channels_with_pins = [];
    const channels_without_pins = [];
    const newChannels = [];
    if (this.props.currentUser && msgsArray) {
      const userUid = this.props.currentUser.uid;
      this.state.usersRef
        .child(userUid)
        .child("pinned")
        .orderByChild(`${userUid}/timestamp`)
        .once("value")
        .then((data) => {
          if (data.val() !== null) {
            const channelIds = Object.keys(data.val());
            if (channels.length) {
              var arr1 = channels,
                arr2 = channelIds,
                res = arr1.filter(
                  (item) => item !== null && !arr2.includes(item.id)
                ),
                res2 = arr1.filter(
                  (item) => item !== null && arr2.includes(item.id)
                );
              channels_without_pins.push(...res);
              channels_with_pins.push(...res2);
              this.setState({
                pinnedChannels: channels_with_pins,
                unPinnedChannels: channels_without_pins,
              });
              if (channels_without_pins) {
                var merged = channels_with_pins.concat(channels_without_pins);
                newChannels.push(...merged);
              }
            }
          } else {
            if (channels) {
              this.setState({
                unPinnedChannels: channels,
              });
            }
          }
        });
    }
  };

  onClickAway = () => {
    this.setState({
      homeIconState: false,
      dmIconState: false,
      starIconState: false,
      youIconState: false,
    });
  };

  addNotificationListener = (channelId) => {
    const { messagesRef } = this.state;
    messagesRef.child(channelId).on("value", (snap) => {
      this.handleNotifications(channelId, this.state.notifications, snap);
    });
  };

  // addPrivateNotificationListener = (channelId) => {
  // this.state.messagesRef.child(channelId).on("value", (snap) => {
  //   this.handlePrivateNotifications(channelId, this.state.privateChatNotifications, snap);
  // });

  // };

  handleNotifications = (channelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      (notification) => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId) {
        lastTotal = notifications[index].total;
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }

    this.setState({ notifications });
  };

  // handlePrivateNotifications = (channelId, privateChatNotifications, snap) => {
  //   let lastTotal = 0;

  //   let index = privateChatNotifications.findIndex(
  //     (notification) => notification.id === channelId
  //   );

  //   if (index !== -1) {
  //     if (channelId) {
  //       lastTotal = privateChatNotifications[index].total;
  //       if (snap.numChildren() - lastTotal > 0) {
  //         privateChatNotifications[index].count = snap.numChildren() - lastTotal;
  //       }
  //     }
  //     privateChatNotifications[index].lastKnownTotal = snap.numChildren();
  //   } else {
  //       privateChatNotifications.push({
  //         id: channelId,
  //         total: snap.numChildren(),
  //         lastKnownTotal: snap.numChildren(),
  //         count: 0,
  //       });
  //   }

  //   this.setState({ privateChatNotifications });
  //   this.props.setNotification(privateChatNotifications)
  // };

  clearNotifications = (channel) => {
    let currentChannel = channel;
    let channelId;
    if (currentChannel) {
      channelId = currentChannel.id;
      let index = this.state.notifications.findIndex(
        (notification) => notification.id === channelId
      );

      if (index !== -1) {
        let updatedNotifications = [...this.state.notifications];
        let user = this.props.currentUser;
        updatedNotifications[index].total = this.state.notifications[
          index
        ].lastKnownTotal;
        updatedNotifications[index].count = 0;
        this.setState({ notifications: updatedNotifications });
        Cookies.set(user.uid, updatedNotifications, { expires: 365 });
      }
    }
  };

  onChannelSetCount = (channel) => {
    this.state.notifications.forEach((notification) => {
      if (notification.id === channel.id) {
        if (notification.count > 0) {
          notification.count = 0;
        }
      }
    });
    this.clearNotifications(channel);
  };

  handleNone = () => {
    this.setState({
      homeIconState: false,
      dmIconState: false,
      starIconState: false,
      youIconState: false,
    });
  };

  handleHome = () => {
    this.groupCheckSetter();
    this.setState({
      homeIconState: true,
      dmIconState: false,
      starIconState: false,
      youIconState: false,
    });
  };

  handleDm = () => {
    this.dmCheckSetter();
    this.setState({
      homeIconState: false,
      dmIconState: true,
      starIconState: false,
      youIconState: false,
    });
  };

  handleStarred = () => {
    this.starCheckSetter();
    this.setState({
      homeIconState: false,
      dmIconState: false,
      starIconState: true,
      youIconState: false,
    });
  };

  handleYou = () => {
    this.profileCheckSetter();
    this.setState({
      homeIconState: false,
      dmIconState: false,
      starIconState: false,
      youIconState: true,
    });
  };

  removeListeners = () => {
    this.state.channelsRef.off();
    this.state.messagesRef.off();
    this.state.usersRef.off();
    this.state.privateMessagesIdRef.off();
  };

  componentWillUnmount() {
    this.removeListeners();
    this.setState = (state, callback) => {
      return;
    };
  }

  verifyCrooner = () => {
    this.setState({
      redirect: true,
      verify: true,
    });
  };

  changeChannel = (channel) => {
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState(
      {
        redirect: true,
      },
      () => this.checkSubscriberByID()
    );
    this.clearNotifications(channel);
    this.setState({ channel });
  };

  checkSubscriberByID = () => {
    const channel_suscribers_id = this.props.currentChannel.suscribed_users && this.props.currentChannel.suscribed_users
      .users_id;
    const current_user_id = this.props.currentUser.uid;
    if (!!channel_suscribers_id && !!current_user_id) {
      if (channel_suscribers_id.includes(current_user_id)) {
        this.setState({ ...this.state, verify: true });
      } else {
        this.setState({ ...this.state, redirect: true, verify: false });
      }
    }
  };

  remountComponent = () => {
    this.setState({
      childKey: Math.random(),
    });
  };

  remountComponentOnNC = () => {
    this.props.updateChannelComp();
  };

  remountCLComp = () => {
    this.setState({
      newChankey: Math.random(),
    });
  };

  getUpdatedCurrentChannelById = (channel) => {
    let updatedChannel = channel;
    this.state.channelsRef.child(channel.id).on("value", (collection_data) => {
      const channel_data = collection_data.val();
      updatedChannel = channel_data;
    });
    return updatedChannel;
  };

  changeChannelDesktop = (channel) => {
    this.clearNotifications(channel);
    const updatedChannel = this.getUpdatedCurrentChannelById(channel);
    this.props.setCurrentChannel(updatedChannel);
    this.props.setPrivateChannel(false);
    this.setState({ updatedChannel }, () =>
      this.checkSubscriberByIdDesktop(updatedChannel)
    );
    this.remountComponent();
  };

  AIModalReverse = (channel) => {
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({
      isAIModal: true,
    });
  };

  AIModalReverseAlt = () => {
    this.props.setCurrentChannel(null);
    this.props.setPrivateChannel(false);
    this.setState({
      isAIModal: false,
    });
  };

  AIModalReverseAltNoReload = () => {
    this.setState({
      isAIModal: false,
    });
  };

  checkSubscriberByIdDesktop = (channel) => {
    if (channel !== null) {
      if (this.isUserSubscribed(channel)) {
        this.setState({ verifyDesktop: true, isAIModal: false });
      } else {
        this.setState({
          verifyDesktop: false,
          redirect: false,
          groupCheck: true,
          verify: false,
          isAIModal: true,
        });
      }
    }
  };

  isUserSubscribed = (channel) => {
    let isSubscribed = false;
    if (channel !== null) {
      const channel_suscribers_id = channel.suscribed_users.users_id;
      const current_user_id = this.props.currentUser.uid;
      if (!!channel_suscribers_id && !!current_user_id) {
        if (channel_suscribers_id.includes(current_user_id)) {
          isSubscribed = true;
        } else {
          isSubscribed = false;
        }
      }
    }
    return isSubscribed;
  };

  ignoreChannel = () => {
    this.setState({ redirect: false });
  };

  acceptChannel = () => {
    const user = this.props.currentUser;
    const user_uid = user.uid;
    const displayName = user.displayName;
    const username = `${displayName}_${user_uid}`;
    const { channelsRef } = this.state;
    const current_channel_id = this.props.currentChannel.id;

    channelsRef.child(current_channel_id).once("value", (collection_data) => {
      const channel_data = collection_data.val();
      const existing_users_ids = channel_data.suscribed_users && channel_data.suscribed_users.users_id;
      const existing_usernames = channel_data.suscribed_users && channel_data.suscribed_users.users_name;
      if (existing_users_ids && existing_users_ids.includes(user_uid) === false) {
        existing_users_ids.push(user_uid);
        channelsRef.child(current_channel_id).update(channel_data);
        this.setState(
          { verify: true, verifyDesktop: true, isUserVerifiedTop: true },
          () => this.generateChannelSubscriptionPair()
        );
        this.props.setCurrentChannel(channel_data);
      }
      if (existing_usernames && existing_usernames.includes(username) === false) {
        existing_usernames.push(username);
        channelsRef.child(current_channel_id).update(channel_data);
      }
    });
  };

  // acceptChannel = () => {
  //   this.setState({ verify: true });
  //   const user_uid = this.props.currentUser.uid;
  //   const username = this.props.currentUser.displayName;
  //   const { channelsRef } = this.state;
  //   const current_channel_id = this.props.currentChannel.id;

  //   channelsRef.child(current_channel_id).on("value", (collection_data) => {
  //     const channel_data = collection_data.val();
  //     const existing_users_ids = channel_data.suscribed_users.users_id;
  //     const existing_usernames = channel_data.suscribed_users.users_name;
  //     if (existing_users_ids.includes(user_uid) === false) {
  //       existing_users_ids.push(user_uid);
  //       channelsRef.child(current_channel_id).update(channel_data);
  //     }
  //     if (existing_usernames.includes(username) === false) {
  //       existing_usernames.push(username);
  //       channelsRef.child(current_channel_id).update(channel_data);
  //     }
  //   });
  // };

  removeHamModal = () => {
    this.setState({
      profileCheck: false,
    });
  };

  getInitialActivity = (user, channelItem) => {
    let initialActivity = "";
    if (user && channelItem) {
      const channelName = channelItem.name;
      const channelcreator = channelItem.createdBy.name;
      const userCheck = () => {
        let iCreated = false;
        if (user.uid === channelItem.createdBy.id) {
          iCreated = true;
        }
        return iCreated;
      };
      const whichUser = userCheck() ? "You" : channelcreator;
      const initialMessage = (
        <ManeteeSpan>
          {" "}
          {shortenFileName(
            capitalizeFirstLetter(whichUser),
            10,
            0.99,
            "..."
          )}{" "}
          created "{shortenFileName(channelName, 20, 0.99, "...")}"
        </ManeteeSpan>
      );
      initialActivity = initialMessage;
    }
    return initialActivity;
  };

  getLastMessageFromChannel = (channelId) => {
    const { user, messagesRef } = this.state;
    let activity = "";
    let timestamp = "";
    let snapData = [];
    if (user) {
      messagesRef.child(channelId).once("value", (snap) => {
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
          if (lastMsg) {
            const fullDetaill = `${lastMsg.content}`;
            const fullDetail2 = `${lastMsg.user.name}: ${lastMsg.content}`;
            if (lastMsg) {
              timestamp = lastMsg.timestamp;
              if (lastMsg.content) {
                if (user.uid === lastMsg.user.id) {
                  activity = (
                    <ManeteeSpan className="make_flex">
                      <RiCheckFill className="one_remer" />{" "}
                      {shortenFileName(fullDetaill, 35, 0.99, "...")}
                    </ManeteeSpan>
                  );
                } else {
                  activity = (
                    <span>{shortenFileName(fullDetail2, 35, 0.99, "...")}</span>
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
                        {lastMsg.user.name}:{" "}
                        <HiPhotograph className="photo_icon_item" />
                        <span className="photo_icon_item_2">Photo</span>{" "}
                      </span>
                    </span>
                  );
                }
              }
            }
          }
        }
      });
    }
    const data = {
      activity: activity,
      timestamp: timestamp,
    };
    return data;
  };

  lastMsgsRefiner = (msg) => {
    const { user } = this.state;
    let default_message = "";
    if (msg) {
      const fullDetaill = `${msg.content}`;
      const fullDetail2 = `${msg.user.name}: ${msg.content}`;
      if (msg) {
        if (msg.content) {
          if (user && user.uid === msg.user.id) {
            default_message = (
              <ManeteeSpan className="make_flex">
                <RiCheckFill className="one_remer" />{" "}
                {shortenFileName(fullDetaill, 35, 0.99, "...")}
              </ManeteeSpan>
            );
          } else {
            default_message = (
              <span>{shortenFileName(fullDetail2, 35, 0.99, "...")}</span>
            );
          }
        } else {
          if (user && user.uid === msg.user.id) {
            default_message = (
              <span className="photo_icon">
                <RiCheckFill className="one_remer" />
                <HiPhotograph className="photo_icon_item" />
                <span className="photo_icon_item_2">Photo</span>
              </span>
            );
          } else {
            default_message = (
              <span>
                <span className="photo_icon">
                  {msg.user.name}: <HiPhotograph className="photo_icon_item" />
                  <span className="photo_icon_item_2">Photo</span>
                </span>
              </span>
            );
          }
        }
      }
    }
    return default_message;
  };

  generateLastMsgPair = () => {
    const { messagesRef } = this.state;
    const snapData = [];
    messagesRef.once("value", (snapshot) => {
      snapData.push(snapshot.val());
      const msgsArray = snapData.reduce((accumulator, data) => {
        accumulator.push(data);
        if (accumulator[0]) {
          const msgObj = accumulator[0];
          const msgObjKey = Object.keys(msgObj);
          const msgArrayObject = msgObjKey.map((key) => {
            const objItem = msgObj[key];
            const subMsgs = [];
            subMsgs.push(objItem);

            const subMsgsArray = subMsgs.reduce((accumulator, data) => {
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

            let lastItem = subMsgsArray[subMsgsArray.length - 1];

            if (
              lastItem.hasOwnProperty("message_id") &&
              lastItem.hasOwnProperty("timestamp") &&
              lastItem.hasOwnProperty("user")
            ) {
              const pair = {
                channel_id: key,
                timestamp: lastItem.timestamp,
                type: lastItem.image ? "image" : "content",
                message: this.lastMsgsRefiner(lastItem),
                sender: {
                  name: lastItem.user.name,
                  id: lastItem.user.id,
                },
              };
              return pair;
            }

            return null;
          });
          accumulator = msgArrayObject;
        }
        return accumulator;
      }, []);

      const removeNullFromMsgsArray = msgsArray.filter((item) => item !== null);

      this.setState({
        lastMessagePair: removeNullFromMsgsArray,
      });
    });
  };

  cCMountedAdd = () => {
    this.setState({
      cCMounted: true,
    });
  };

  cCMountedMinus = () => {
    this.setState({
      cCMounted: false,
    });
  };

  onlineDectectorById = (currentUserUid) => {
    var status = moment(this.userPresenceCheckTest(currentUserUid)).calendar();
    let presence_object = this.props.onlineLive;
    if (presence_object) {
      let all_online_ids = Object.keys(presence_object);
      if (all_online_ids.length) {
        all_online_ids.map((id) => {
          if (id.includes(currentUserUid)) {
            status = "online";
          }
          return status;
        });
      }
    }
    return status;
  };

  userPresenceCheckTest = (currentUserUid) => {
    const online = [];
    const onlineStatStore = this.props.onlineStatusObject;
    if (onlineStatStore) {
      const idArray = Object.keys(onlineStatStore);
      idArray.map((id) => {
        if (currentUserUid === id) {
          let last_seen = onlineStatStore[id].last_seen;
          online.push(last_seen);
        }
        return online[0];
      });
    }
    return online[0];
  };

  // Start Avatar Logic

  generateIdAvatarPair = () => {
    const { usersRef } = this.state;
    const snapData = [];
    usersRef.once("value", (snapshot) => {
      snapData.push(snapshot.val());

      const usersArray = snapData.reduce((accumulator, data) => {
        accumulator.push(data);
        if (accumulator[0]) {
          const msgObj = accumulator[0];
          const msgObjKey = Object.keys(msgObj);
          const msgArrayObject = msgObjKey.map((key) => {
            const objItem = msgObj[key];
            const pair = {
              id: key,
              avatar: objItem.avatar,
            };
            return pair;
          });
          accumulator = msgArrayObject;
        }
        return accumulator;
      }, []);
       this.props.setUsersAvatarPair(usersArray)
      this.setState({
        userAvatarPair: usersArray,
      });
    });
  };

  retrieveAvatarFromId = (id) => {
    const { userAvatarPair } = this.state;
    if (userAvatarPair) {
      const itemSpecific = userAvatarPair.filter((item) => item.id === id);
      if (itemSpecific.length > 0) {
        const avatar = itemSpecific[0].avatar;
        return avatar
      }
    }
    return loading_svg;
  };

  // End Avatar Logic

  render() {
    const {
      redirect,
      channels,
      modal,
      verify,
      dmCheck,
      groupCheck,
      sidebar,
      notifications,
      privateChatNotifications,
      profileCheck,
      starCheck,
      aboutCheck,
      displayBottomNav,
      homeIconState,
      dmIconState,
      starIconState,
      youIconState,
      displayProfileImage,
      profileAltCheck,
      cCMounted,
      verifyDesktop,
      messages,
      childKey,
      pinnedKey,
      unpinnedKey,
      isAIModal,
      isUserVerifiedTop,
      loading,
      error,
      channelName,
      channelDetails,
      newChankey,
      isCLModal,
      channelSubscriptionPair,
      unPinnedChannels,
      pinnedChannels,
      lastMessagePair,
      byepassVrfOnMount,
      dmCheckDesktop,
      starCheckDesktop,
      users,
      all_users,
      online_pc_status,
      DMFinalVerifyTop,
      profileAltKey,
      groupInfoKey,
      isPreloading
    } = this.state;

    const {
      currentUser,
      currentChannel,
      isPrivateChannel,
      compStatus,
      userInView,
      setPrivateChannel,
      setCurrentChannel,
      themeToggler,
      theme
    } = this.props;

    const moreProps = {
      submit: this.handleSubmit,
      handleChange: this.handleChange,
      removeError: this.removeError,
    };

    if(isPreloading) {
      return <Preloader />;
    }

    return (
      <ChannelParentThemefy className="channel_parent">
        {redirect ? (
          verify ? (
            <ChannelChat
              key={childKey}
              ignoreChannel={this.ignoreChannel}
              isPrivateChannel={isPrivateChannel}
              onChannelSetCount={this.onChannelSetCount}
              notifications={notifications}
              channelClearNoti={this.clearNotifications}
              groupCheckSetter={this.groupCheckSetter}
              groupCheckSetterV2={this.groupCheckSetterV2}
              dmCheckSetterV2={this.dmCheckSetterV2}
              dmCheckSetter={this.dmCheckSetter}
              profileAltSetter={this.profileAltSetter}
              currentUser={currentUser}
              cCMounted={cCMounted}
              cCMountedAdd={this.cCMountedAdd}
              cCMountedMinus={this.cCMountedMinus}
              onlineDectectorById={this.onlineDectectorById}
              userPresenceCheckTest={this.userPresenceCheckTest}
              generateLastMsgPair={this.generateLastMsgPair}
              retrieveAvatarFromId={this.retrieveAvatarFromId}
              groupCheckSetterDesktop={this.groupCheckSetterDesktop}
            />
          ) : (
            <>
              <ModalAnimate
                verify={verify}
                acceptChannel={this.acceptChannel}
                ignoreChannel={this.ignoreChannel}
                verifyCrooner={this.verifyCrooner}
                currentUser={currentUser}
                currentChannel={currentChannel}
              />
            </>
          )
        ) : (
          <>
            {groupCheck ? (
              <ChannelList
                key={newChankey}
                channels={channels}
                pinnedKey={pinnedKey}
                unpinnedKey={unpinnedKey}
                verifyDesktop={verifyDesktop}
                cCMounted={cCMounted}
                changeChannel={this.changeChannel}
                openModal={this.openModal}
                dmCheckSetter={this.dmCheckSetter}
                groupCheckSetter={this.groupCheckSetter}
                sidebar={sidebar}
                sidebarSwitcher={this.sidebarSwitcher}
                sidebarSwitcherReverse={this.sidebarSwitcherReverse}
                notifications={notifications}
                rawNotificationFromChannel={notifications}
                currentUser={currentUser}
                currentChannel={currentChannel}
                profileCheckSetter={this.profileCheckSetter}
                starCheckSetter={this.starCheckSetter}
                getLastMessageFromChannel={this.getLastMessageFromChannel}
                getInitialActivity={this.getInitialActivity}
                changeChannelDesktop={this.changeChannelDesktop}
                ignoreChannel={this.ignoreChannel}
                isPrivateChannel={isPrivateChannel}
                onChannelSetCount={this.onChannelSetCount}
                channelClearNoti={this.clearNotifications}
                profileAltSetter={this.profileAltSetter}
                cCMountedAdd={this.cCMountedAdd}
                cCMountedMinus={this.cCMountedMinus}
                onlineDectectorById={this.onlineDectectorById}
                userPresenceCheckTest={this.userPresenceCheckTest}
                messages={messages}
                childKey={childKey}
                isUserSubscribed={this.isUserSubscribed}
                verify={verify}
                acceptChannel={this.acceptChannel}
                verifyCrooner={this.verifyCrooner}
                isAIModal={isAIModal}
                AIModalReverse={this.AIModalReverse}
                AIModalReverseAlt={this.AIModalReverseAlt}
                AIModalReverseAltNoReload={this.AIModalReverseAltNoReload}
                isUserVerifiedTop={isUserVerifiedTop}
                remountComponent={this.remountComponent}
                loading={loading}
                error={error}
                moreProps={moreProps}
                channelName={channelName}
                channelDetails={channelDetails}
                remountComponentOnNC={this.remountComponentOnNC}
                isCLModal={isCLModal}
                CLModalReverse={this.CLModalReverse}
                generateCSP={this.generateChannelSubscriptionPair}
                channelSubscriptionPair={channelSubscriptionPair}
                unsetVerifyDesktop={this.unsetVerifyDesktop}
                unPinnedChannels={unPinnedChannels}
                pinnedChannels={pinnedChannels}
                lastMessagePair={lastMessagePair}
                generateLastMsgPair={this.generateLastMsgPair}
                hasChannelUpdated={this.hasChannelUpdated}
                byepassVrfOnMount={byepassVrfOnMount}
                groupCheckSetterDesktop={this.groupCheckSetterDesktop}
                dmCheckSetterDesktop={this.dmCheckSetterDesktop}
                privateChatNotifications={privateChatNotifications}
                dmCheckDesktop={dmCheckDesktop}
                starCheckDesktop={starCheckDesktop}
                users={users}
                all_users={all_users}
                online_pc_status={online_pc_status}
                displayOnlineStatus={this.displayOnlineStatus}
                getNotificationCount={this.getNotificationCount}
                moreThanThreeCount={this.moreThanThreeCount}
                getLastMessageFromPrivateUser={
                  this.getLastMessageFromPrivateUser
                }
                generateLastMsgPairPrivate={this.generateLastMsgPairPrivate}
                changePrivateChannelDesktop={this.changePrivateChannelDesktop}
                DMFinalVerifyTop={DMFinalVerifyTop}
                profileAltKey={profileAltKey}
                groupInfoKey={groupInfoKey}
                userInView={userInView}
                setDMFinalVerifyTop={this.setDMFinalVerifyTop}
                remountProfileComponent={this.remountProfileComponent}
                remountGIComponent={this.remountGIComponent}
                setPrivateChannel={setPrivateChannel}
                setCurrentChannel={setCurrentChannel}
                retrieveAvatarFromId={this.retrieveAvatarFromId}
                starCheckSetterDesktop={this.starCheckSetterDesktop}
                themeToggler={themeToggler}
                theme={theme}
              />
            ) : dmCheck ? (
              <PrivateChatList
                sidebar={sidebar}
                sidebarSwitcherReverse={this.sidebarSwitcherReverse}
                sidebarSwitcher={this.sidebarSwitcher}
                dmCheckSetter={this.dmCheckSetter}
                groupCheckSetter={this.groupCheckSetter}
                currentUser={currentUser}
                verifyCrooner={this.verifyCrooner}
                privateChatNotifications={privateChatNotifications}
                profileCheckSetter={this.profileCheckSetter}
                starCheckSetter={this.starCheckSetter}
                getLastMessageFromChannel={this.getLastMessageFromChannel}
                getInitialActivity={this.getInitialActivity}
                dmCheckDesktop={dmCheckDesktop}
              />
            ) : profileCheck ? (
              <Profile
                goBack={this.groupCheckSetter}
                currentUser={this.props.currentUser}
                groupCheckSetter={this.groupCheckSetter}
                aboutCheckSetter={this.aboutCheckSetter}
                dmCheckSetter={this.dmCheckSetter}
                removeHamModal={this.removeHamModal}
                profileImageCheckSetter={this.profileImageCheckSetter}
                profileCheck={profileCheck}
                groupCheckSetterDesktop={this.groupCheckSetterDesktop}
              />
            ) : null}

            {starCheck ? (
              <StarredMsgs
                goBack={this.groupCheckSetter}
                groupCheckSetter={this.groupCheckSetter}
                dmCheckSetter={this.dmCheckSetter}
                removeHamModal={this.removeHamModal}
              />
            ) : null}

            {aboutCheck ? (
              <About
                goBack={this.profileCheckSetter}
                profileCheckSetter={this.profileCheckSetter}
                removeHamModal={this.removeHamModal}
                setBottomNavActive={this.setBottomNavActive}
                setBottomNavInactive={this.setBottomNavInactive}
              />
            ) : null}

            {modal ? (
              <ChannelModal
                {...this.state}
                closeModal={this.closeModal}
                submit={this.handleSubmit}
                handleChange={this.handleChange}
              />
            ) : (
              ""
            )}
            <div className="queryNavigation--Ch">
              {displayBottomNav && (
                <BottomNav
                  ref={{
                    homeRef: this.homeRef,
                    dmRef: this.dmRef,
                    starRef: this.starRef,
                    youRef: this.youRef,
                    bnRef: this.bnRef,
                  }}
                  handleHome={this.handleHome}
                  handleDm={this.handleDm}
                  handleStarred={this.handleStarred}
                  handleYou={this.handleYou}
                  handleNone={this.handleNone}
                  homeIconState={homeIconState}
                  dmIconState={dmIconState}
                  starIconState={starIconState}
                  youIconState={youIconState}
                  compStatus={compStatus}
                />
              )}
            </div>

            {displayProfileImage && (
              <ProfileImage
                setProfileImageInactive={this.setProfileImageInactive}
                goBack={this.profileCheckSetter}
                groupCheckSetter={this.groupCheckSetter}
                dmCheckSetter={this.dmCheckSetter}
                profileCheckSetter={this.profileCheckSetter}
              />
            )}

            {profileAltCheck && (
              <ProfileAlt
                goBack={this.chatCheckSetter}
                currentUser={this.props.currentUser}
                groupCheckSetter={this.groupCheckSetter}
                aboutCheckSetter={this.aboutCheckSetter}
                dmCheckSetter={this.dmCheckSetter}
                removeHamModal={this.removeHamModal}
                profileImageCheckSetter={this.profileImageCheckSetter}
                verifyCrooner={this.verifyCrooner}
                onlineDectectorById={this.onlineDectectorById}
              />
            )}
          </>
        )}
      </ChannelParentThemefy>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
    compStatus: state.compStatus.component_status,
    onlineStatusObject: state.channel.onlineStatus,
    onlineLive: state.channel.onlineLive,
    userInView: state.userInView.currentUserInView,
    theme: state.theme.color
  };
};

export default withRouter(
  connect(mapStateToProps, {
    setCurrentChannel,
    setPrivateChannel,
    setActiveComponent,
    setUserCurrentlyInView,
    setUsersAvatarPair
  })(Channel)
);


