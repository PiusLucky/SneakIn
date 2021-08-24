import React, {
  Component
} from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import ErrorPage from "../404";

import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { v4 as uuidv4 } from "uuid";
import ChannelChatFunc from "./ChannelChat/ChannelChatFunc";

import moment from "moment";
import {
  setOnlineLive,
  setOnlineStatus,
  setNotification,
  setChannelNotification,
  setUserCurrentlyInView,
  setChannelMessage
} from "../../actions";
import Cookies from "js-cookie";
import "react-image-lightbox/style.css";
import loading_svg from "../../static/img/loading/loading.svg";


class ChannelChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.currentUser,
      channel: this.props.currentChannel,
      messagesRef: firebase.database().ref("messages"),
      storageRef: firebase.storage().ref(), // Involking firebase storage
      uploadTask: null,
      uploadState: "",
      percentUploaded: 0,
      message: "",
      messages: [],
      currentChannelID: this.props.currentChannel.id,
      currentChannelName: this.props.currentChannel.name,
      loading: false,
      errors: [],
      messagesLoading: false,
      modal: false,
      newMessageTracker: "",
      hamModal: false,
      searchTerm: "",
      searchLoading: false,
      searchResults: [],
      usersRef: firebase.database().ref("users"),
      channelsRef: firebase.database().ref("channels"),
      typingRef: firebase.database().ref("typing"),
      listeners: [],
      isChannelStarred: false,
      isChannelPinned: false,
      isMessageFromChannelStarred: false,
      presenceRef: firebase.database().ref("presence"),
      onlineStatus: false,
      lastOnlineRef: firebase.database().ref("lastOnlinePresence"),
      notifications: [this.props.channelNotifications],
      privateChatNotifications: this.props.allNotifications,
      areYouSureTracker: false,
      connectedRef: firebase.database().ref(".info/connected"),
      uniqueUsersRef: firebase.database().ref("unique_id_of_users"),
      typingUsers: [],
      isAdmin: false,
      componentUpdated: "",
      mountedStatus: false,
      photoIndex: 0,
      isOpen: false,
      imagesArray: [],
      imageDetail: null,
      contactInfo: null,
      audioFile: null,
      childRemovedTracker: null,
      finalVerifyTop: false,
      messageKey: Math.random(),
      currentStringIndex: 0,
      messageTyped: "",
      userAvatarPair: []
      
    };
    this.inputFieldRef = React.createRef();
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidMount() {
    // const { match, location, history } = this.props;
    const { channel, user } = this.state;
    if (channel && user) {
      this.addListeners(channel.id);
      this.getFinalVerifyTop();
      this.addUsersStarsListeners(channel.id, user.uid);
      this.addChannelPinListeners(channel.id, user.uid);
      this.props.cCMountedAdd();
      this.setMessageKey();
      this.setDefaultStringIndex();
      this.setAvatarPairOnMount();
    }



    let noti = this.props.notifications;
    this.setState({
      notifications: noti,
      mountedStatus: uuidv4(),
    });

    this.checkAdmin();
    this.lastMsgPairGenerator();
  }

  setAvatarPairOnMount = () => {
    this.setState({
      userAvatarPair: this.props.usersAvatarPair
    })
  }


  lastMsgPairGenerator = () => {
    // Generates new lastmessage pairs whenever a message is added to database
    this.state.messagesRef.on('value', snap => {
      this.props.generateLastMsgPair()
    });
  }

  setDefaultStringIndex = () => {;
    const { message } = this.state
    if(message) {
      const messageLen = message.length
      this.setState({
         currentStringIndex: messageLen
      })
    }
  }



  handleFocus = (event) => {
    const { message } = this.state
    this.setState({
      messageTyped: message
    }, () => this.trackCursorPosition())
  }

  handleAddEmoji = emoji => {
    const { currentStringIndex } = this.state

    const targetRefValue = this.inputFieldRef.current.value

    const firstPart = targetRefValue.slice(0, currentStringIndex)

    const secondPart = targetRefValue.slice(currentStringIndex)

    const middlePart = emoji

    const fullText  = `${firstPart} ${middlePart } ${secondPart}`


    this.setState({ message: fullText, currentStringIndex: fullText.length });


    setTimeout(() => this.inputFieldRef.current.focus(), 0);

    
    
  };



  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value, messageTyped: event.target.value });
  };


  trackCursorPosition = () => {
    const targetRef = this.inputFieldRef.current
    if(targetRef !== null) {
      targetRef.addEventListener('keyup', e => {
        this.setState({
          currentStringIndex: e.target.selectionStart
        })
      })
      targetRef.addEventListener('click', e => {
        this.setState({
          currentStringIndex: e.target.selectionStart
        })
      })
    }
   
  }

  setMessageKey = () => {
    this.setState({
      messageKey: Math.random(),
    });
  };

  getFinalVerifyTop = () => {
    const { currentUser, currentChannel } = this.props;
    if (currentUser && currentChannel) {
      this.state.channelsRef
        .child(currentChannel.id)
        .once("value", (collection_data) => {
          const channel_data = collection_data.val();
          if(channel_data !== null) {
            const existing_users_ids = channel_data.suscribed_users && channel_data.suscribed_users.users_id;
            if (existing_users_ids && existing_users_ids.includes(currentUser.uid)) {
              this.setState({
                finalVerifyTop: true,
              });
            } else {
              this.setState({
                finalVerifyTop: false,
              });
            }
          }

        });

        if(!this.props.isDesktop) {
          this.setState({
            finalVerifyTop: true,
          });
        }
    }
  };

  // setNotificationToZero = () => {
  //   const channelCurrent = this.props.currentChannel;
  //   if (this.props.isPrivateChannel) {
  //     this.clearNotifications(channelCurrent);
  //     setTimeout(() => this.setNotificationToZero(), 5000);
  //   } else {
  //     this.clearChannelsNotifications(channelCurrent);
  //     setTimeout(() => this.setNotificationToZero(), 5000);
  //   }
  // };

  addUsersStarsListeners = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then((data) => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          this.setState({ isChannelStarred: prevStarred });
        }
      });
  };

  addChannelPinListeners = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child("pinned")
      .once("value")
      .then((data) => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevPinned = channelIds.includes(channelId);
          this.setState({ isChannelPinned: prevPinned });
        }
      });
  };

  starMsgChecker = (msg) => {
    let object = this.props.starredMsgsFromChannels;
    let starred = false;
    if (object) {
      let starredObjKeys = Object.keys(object);
      if (starredObjKeys.length) {
        starredObjKeys.map((id) => {
          if (id.includes(msg.message_id)) {
            starred = true;
          }
          return starred;
        });
      }
    }
    return starred;
  };

  starChannel = () => {
    if (this.state.isChannelStarred) {
      this.state.usersRef.child(`${this.state.user.uid}/starred`).update({
        [this.state.channel.id]: {
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar,
          },
          timeStarred: firebase.database.ServerValue.TIMESTAMP
        },
      });
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.channel.id)
        .remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
  };

  // pinChannel
  pinChannel = () => {
    if (this.state.isChannelPinned) {
      this.state.usersRef.child(`${this.state.user.uid}/pinned`).update({
        [this.state.channel.id]: {
          name: this.state.channel.name,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
        },
      });
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/pinned`)
        .child(this.state.channel.id)
        .remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
  };

  intialSMFC = (starred) => {
    // initial starMessageFromChannel upon showModal
    if (starred) {
      this.setState({
        isMessageFromChannelStarred: true,
      });
    } else {
      this.setState({
        isMessageFromChannelStarred: false,
      });
    }
  };


  starMessageFromChannel = (msg) => {
    const userRef = this.state.usersRef

    if (this.state.isMessageFromChannelStarred) {
      userRef.child(`${this.state.user.uid}/starredMsgs`).update({
        [msg.message_id]: {
          item: msg.content || msg.image,
          timestamp: msg.timestamp,
          createdBy: {
            name: msg.user.name,
            id: msg.user.id,
          },
          isContent: !!msg.content,
          timeStarred: firebase.database.ServerValue.TIMESTAMP
        },
      });
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/starredMsgs`)
        .child(msg.message_id)
        .remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
    }

  };

  handleStar = () => {
    this.setState(
      (previousState) => ({
        isChannelStarred: !previousState.isChannelStarred,
      }),
      () => this.starChannel()
    );
  };

  handleStarMsg = (msg) => {
    this.setState(
      (previousState) => ({
        isMessageFromChannelStarred: !previousState.isMessageFromChannelStarred,
      }),
      () => this.starMessageFromChannel(msg)
    );
  };

  handlePin = () => {
    this.setState(
      (previousState) => ({
        isChannelPinned: !previousState.isChannelPinned,
      }),
      () => this.pinChannel()
    );
  };

  clearChannelsNotifications = (channel) => {
    let currentChannel = channel;
    const { user, notifications } = this.state;
    let channelId;
    if (currentChannel) {
      channelId = currentChannel.id;
      let index = notifications.findIndex(
        (notification) => notification.id === channelId
      );
      if (index !== -1) {
        let updatedNotifications = [...notifications];
        updatedNotifications[index].total = notifications[index].lastKnownTotal;
        updatedNotifications[index].count = 0;
        this.setState({ notifications: updatedNotifications });
        this.props.setChannelNotification(updatedNotifications);
        Cookies.set(user.uid, updatedNotifications, { expires: 365 });
      }
    }
  };

  clearNotifications = (channel) => {
    let currentChannel = channel;
    let channelId;
    if (currentChannel) {
      channelId = currentChannel.id;
      let index = this.state.privateChatNotifications.findIndex(
        (notification) => notification.id === channelId
      );

      if (index !== -1) {
        let updatedNotifications = [...this.state.privateChatNotifications];
        updatedNotifications[index].total = this.state.privateChatNotifications[
          index
        ].lastKnownTotal;
        updatedNotifications[index].count = 0;
        this.setState({ privateChatNotifications: updatedNotifications });
        this.props.setNotification(updatedNotifications);
        Cookies.set("private_msg", updatedNotifications, { expires: 365 });
      }
    }
  };

  openModal = () => {
    this.setState({ modal: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal
    }));
  }

  closeModal = () => this.setState({ modal: false });

  addListeners = (channelId) => {
    const { presenceRef, lastOnlineRef } = this.state;
    this.addMessageListener(channelId);

    // Runs the Typing Listener
    this.addTypingListeners(channelId);

    // Updates the ChannelChat Redux Last Seen By RDD(Real database data)
    lastOnlineRef.on("value", (snap) => {
      if (snap.val()) {
        const last_seen_user_object = snap.val();
        this.props.setOnlineStatus(last_seen_user_object);
      }
    });

    // Updates the ChannelChat Redux Online Live
    presenceRef.on("value", (snap) => {
      this.props.setOnlineLive(snap.val());
    });
  };

  ImageUrlIndexFinder = (imageArr, message, loadedMsgs) => {
    if (imageArr) {
      let index = imageArr.findIndex((item) => item.image === message.image);
      this.nameTimestampExtractor(loadedMsgs, imageArr[index].image);
      this.setState({
        photoIndex: index,
        isOpen: true,
      });
    }
  };

  nameTimestampExtractor = (loadedMsgs, currentImgUrl) => {
    if (loadedMsgs.length > 0) {
      loadedMsgs.map(
        (loadedMsgsItem) =>
          loadedMsgsItem.image &&
          loadedMsgsItem.image === currentImgUrl &&
          this.setState({
            imageDetail: {
              name: loadedMsgsItem.user.name,
              timestamp: loadedMsgsItem.timestamp,
            },
          })
      );
    }
  };

  openLightBoxModal = (imagesArray, message, loadedMsgs) => {
    this.ImageUrlIndexFinder(imagesArray, message, loadedMsgs);
  };

  addMessageListener = (channelId) => {
    let loadedMessages = [];
    let removedIdsArray = [];
    const { messagesRef } = this.state;
    // messagesRef.child(channelId).on("value", (snap) => {
    //  console.log(snap.val());
    // })
    messagesRef.child(channelId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      // console.log(loadedMessages);
      if (removedIdsArray.length > 0) {
        const filtered = loadedMessages.filter(
          (item) => !removedIdsArray.includes(item.message_id)
        );
        const justImages = filtered.filter((item) => item.image);
        this.setState({
          messages: filtered,
          imagesArray: justImages,
          messagesLoading: false,
          newMessageTracker: uuidv4(),
        });
      } else {
        const justImages = loadedMessages.filter((item) => item.image);
        this.setState({
          messages: loadedMessages,
          imagesArray: justImages,
          messagesLoading: false,
          newMessageTracker: uuidv4(),
        });
      }
      // Update Redux Store
      if(loadedMessages) {
        this.props.setChannelMessage(loadedMessages)
      }
      
    });

    messagesRef.child(channelId).on("child_removed", (snap) => {
      const { messages } = this.state;
      if (snap.val() !== null) {
        const exempt_id = snap.val().message_id;
        removedIdsArray.push(exempt_id);
        const newMsgs = messages.filter(
          (item) => item.message_id !== exempt_id
        );
        const justImages = newMsgs.filter((item) => item.image);
        this.props.setChannelMessage(newMsgs)
        this.setState({
          messages: newMsgs,
          imagesArray: justImages,
          messagesLoading: false,
          newMessageTracker: uuidv4(),
        });
      }
    });
  };



  handleSend = (event) => {
    event.preventDefault();
    this.sendMessage();
    this.props.channelClearNoti(this.state.channel);
  };

  createMessage = (fileUrl = null) => {
    const { messagesRef, messages } = this.state;
    const { uid, displayName, photoURL } = this.props.currentUser;

    const key = messagesRef.push().key;
    const message = {
      message_id: key,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: uid,
        name: displayName,
        avatar: photoURL,
      },
    };

    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }

    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const lastMsgDay = Number(moment(lastMessage.timestamp).format("D"));
      const lastMsgMonth = Number(moment(lastMessage.timestamp).format("M"));
      const todaysDay = Number(moment().format("D"));
      const todaysMonth = Number(moment().format("M"));

      if (todaysMonth > lastMsgMonth && todaysDay === 1) {
        message["first_message_today"] = true;
      } else {
        if (
          todaysMonth === lastMsgMonth &&
          todaysDay !== 1 &&
          todaysDay > lastMsgDay
        ) {
          message["first_message_today"] = true;
        }
      }
    } else {
      if (messages.length === 0) {
        message["first_message_today"] = true;
      }
    }

    return message;
  };

  sendMessage = () => {
    const {
      messagesRef,
      currentChannelID,
      typingRef,
      channel,
      user,
    } = this.state;
    const { message } = this.state;

    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(currentChannelID)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", messageTyped:"", errors: [] });
          typingRef.child(channel.id).child(user.uid).remove();
        })
        .then(() => {
          const userInListId = this.props.currentChannel.dm_id;
          const currentUserId = this.props.currentUser.uid;
          const { uniqueUsersRef } = this.state;

          const suscribedUsers = {
            suscribedUsersId: [currentUserId],
          };

          uniqueUsersRef.once("value", (snap) => {
            const data = snap.val();
            if (data !== null) {
              let available_ids = Object.keys(data);
              if (available_ids.includes(userInListId) === false) {
                data[userInListId] = suscribedUsers;
                uniqueUsersRef
                  .child(`${userInListId}`)
                  .update(data[userInListId]);
              }
            }
          });
        })
        .then(() => {
          this.props.generateLastMsgPair()
        })
        .catch((err) => {
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" }),
      });
    }
  };

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private/${this.state.channel.id}`;
    } else {
      return "chat/public";
    }
  };

  // Uploading images/media as message
  uploadFile = (file, metadata) => {
    const pathToUpload = this.props.currentChannel.id;
    const ref = this.state.messagesRef;
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          (err) => {
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch((err) => {
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null,
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch((err) => {
        this.setState({
          errors: this.state.errors.concat(err),
        });
      });
  };

  // end Uploading file

  // Search functionality
  handleSearchChange = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    );
  };

  searchResultSetter = () => {
    this.setState({ searchResults: this.state.messages });
  };

  handleSearchMessages = () => {
    const msgs = this.state.messages;
    const channelMessages = [...msgs]; //not mutating the messages state, just a copy.
    const regex = new RegExp(this.state.searchTerm, "gi"); // g=(global flag, all possible matches) i=(ignoreCase, case insensitive)
    const searchResults = channelMessages.reduce((accumulator, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        accumulator.push(message); //here, we are pushing message to the accumulator Array for each iteration, since "message" means the current iteration.
      }

      return accumulator; // Always return an accumulator in reduce.
    }, []); // specifying empty array here means that the "accumulator" returns an Array.
    this.setState({ searchResults });
    if (searchResults.length === 0) {
      this.returnMessageInitial();
    }
    setTimeout(() => this.setState({ searchLoading: false }), 1000); // onChange of search input, turns the value of searchLoading to false every one second.
  };

  returnMessageInitial = () => {
    this.setState({ searchResults: this.state.messages });
  };

  // end Search functionality

  removeListeners = () => {
    this.state.messagesRef.off();
    this.state.usersRef.off();
    this.state.channelsRef.off();
    this.state.typingRef.off();
    this.state.presenceRef.off();
    this.state.lastOnlineRef.off();
  };

  checkAdmin = () => {
    const { channelsRef, currentChannelID, user } = this.state;
    if (user) {
      channelsRef
        .child(`${currentChannelID}/suscribed_users/users_id`)
        .on("value", (snapshot) => {
          const all_users_array = snapshot.val();
          if (all_users_array !== null) {
            if (all_users_array[0] === user.uid) {
              this.setState({
                isAdmin: true,
              });
            }
          }
        });
    }
  };

  userInView = (user) => {
    if (user) {
      this.props.profileAltSetter();
      this.props.setUserCurrentlyInView(user);
    }
  };

  userInViewDesktop = (user) => {
    if (user) {
      this.props.setUserCurrentlyInView(user);
    }
  };


  removeMessageStar = (channel) => {
    this.state.usersRef
      .child(`${this.props.currentUser.uid}/starred`)
      .child(`${channel.id}`)
      .remove((err) => {
        if (err !== null) {
          console.error(err);
        }
      });
  };

  deleteChannelAsAdmin = (event) => {
    event.preventDefault();
    const { isAdmin, channelsRef, channel } = this.state;
    if (channel && isAdmin) {
      this.removeMessageStar(channel);
      channelsRef.child(`${channel.id}`).remove((err) => {
        if (err !== null) {
          console.log(err);
        }
      });

      this.setState(
        (previousState) => ({
          areYouSureTracker: false,
        }),
        () => !this.props.isDesktop?this.props.groupCheckSetter(): this.remountSetChannel()
      );
    }
  };

  remountSetChannel = () => {
    const { remountComponentOnNC, unsetVerifyDesktop} = this.props
    remountComponentOnNC();
    unsetVerifyDesktop();
  }

  showAYSModal = () => {
    this.setState({
      areYouSureTracker: true,
    });
  };

  hideAYSModal = (event) => {
    event.preventDefault();
    this.setState({
      areYouSureTracker: false,
    });
  };

  handleKeyDown = (event) => {
    if (event.ctrlKey && event.keyCode === 13) {
      this.sendMessage();
    }

    const { message, typingRef, channel, user } = this.state;

    if (message) {
      typingRef.child(channel.id).child(user.uid).set(user.displayName);
    } else {
      typingRef.child(channel.id).child(user.uid).remove();
    }
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex((listener) => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({ listeners: this.state.listeners.concat(newListener) });
    }
  };

  addTypingListeners = (channelId) => {
    let typingUsers = [];

    this.state.typingRef.child(channelId).on("child_added", (snap) => {
      if (snap.key !== this.state.user.uid) {
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val(),
        });

        this.setState({ typingUsers });
      }
    });

    this.addToListeners(channelId, this.state.typingRef, "child_added");

    this.state.typingRef.child(channelId).on("child_removed", (snap) => {
      const index = typingUsers.findIndex((user) => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter((user) => user.id !== snap.key);

        this.setState({ typingUsers });
      }
    });

    this.addToListeners(channelId, this.state.typingRef, "child_removed");

    this.state.connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        this.state.typingRef
          .child(channelId)
          .child(this.state.user.uid)
          .onDisconnect()
          .remove((err) => {
            if (err !== null) {
              console.error(err);
            }
          });
      }
    });
  };

  displayTypingUsers = (users) =>
    users.length > 0 &&
    users.map((user) => (
      <div key={user.id}>
        <span className="user__typing">
          {!this.props.isPrivateChannel && `${user.name} is `}typing...
        </span>
      </div>
    ));

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




  nameTimestampExtractorLBX = (currentImgUrl) => {
    const { messages } = this.state;
    if (messages.length > 0) {
      messages.map(
        (messagesItem) =>
          messagesItem.image === currentImgUrl &&
          this.setState({
            imageDetail: {
              name: messagesItem.user.name,
              timestamp: messagesItem.timestamp,
            },
          })
      );
    }
  };

  closeLightBox = () => {
    this.setState({ isOpen: false });
  };

  moveLightBoxPrev = () => {
    const { photoIndex, imagesArray } = this.state;
    this.setState(
      (previousState) => ({
        photoIndex:
          (previousState.photoIndex + imagesArray.length - 1) %
          imagesArray.length,
      }),
      () =>
        this.nameTimestampExtractorLBX(
          imagesArray[
            (photoIndex + imagesArray.length - 1) % imagesArray.length
          ].image
        )
    );
  };

  moveLightBoxNxt = () => {
    const { photoIndex, imagesArray } = this.state;
    this.setState(
      (previousState) => ({
        photoIndex: (previousState.photoIndex + 1) % imagesArray.length,
      }),
      () =>
        this.nameTimestampExtractorLBX(
          imagesArray[(photoIndex + 1) % imagesArray.length].image
        )
    );
  };


  checkProfileDesktop = () => {
    const { channel } = this.state
    const { remountProfileComponent, setIsProfile, setIsProfileAlt } = this.props
    if(channel) {
      const user_in_view = {
        id: channel.dm_id,
        name: channel.name,
      };
      remountProfileComponent();
      setIsProfile(true)
      setIsProfileAlt(false);
      this.userInViewDesktop(user_in_view); 
    }

  };


  componentDidUpdate(prevProps, prevState) {
    // if(prevState.messages !== this.state.messages) {
    //   this.props.generateLastMsgPair()
    // }
    if (prevProps !== this.props) {
      // One way of preventing componentUpdated from updating if starredMsgsFromChannels
      // props changes.
      if (
        prevProps.starredMsgsFromChannels === this.props.starredMsgsFromChannels
      ) {
        this.setState({
          componentUpdated: this.props,
        });
      }

   
    }


  }

  componentWillUnmount() {
    const channelCurrent = this.props.currentChannel;
    this.state.typingRef.child(channelCurrent.id).remove();
    this.removeListeners();
    this.props.onChannelSetCount(channelCurrent);
    // this.onChannelSetCountPrivate(this.state.privateChatNotifications);
    this.clearNotifications(channelCurrent);
    this.clearChannelsNotifications(channelCurrent);
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    const {
      user,
      message,
      messages,
      modal,
      newMessageTracker,
      hamModalTrack,
      searchTerm,
      searchResults,
      onlineStatus,
      isChannelStarred,
      isMessageFromChannelStarred,
      isChannelPinned,
      areYouSureTracker,
      typingUsers,
      isAdmin,
      currentChannelID,
      componentUpdated,
      mountedStatus,
      imagesArray,
      photoIndex,
      isOpen,
      imageDetail,
      channel,
      audioFile,
      messagesRef,
      usersRef,
      finalVerifyTop,
      messageKey,
      messageTyped,
      searchLoading
    } = this.state;

    const {
      currentChannel,
      ignoreChannel,
      isPrivateChannel,
      channelClearNoti,
      groupCheckSetter,
      dmCheckSetter,
      currentUser,
      cCMounted,
      cCMountedAdd,
      cCMountedMinus,
      onlineDectectorById,
      userPresenceCheckTest,
      remountComponentOnNC,
      hasChannelUpdated,
      DMFinalVerifyTop,
      setIsProfileAlt,
      setIsProfile,
      remountProfileComponent,
      handleSetIsGroupInfo,
      setIsGroupInfo,
      groupCheckSetterDesktop,
      groupCheckSetterV2,
      dmCheckSetterV2
    } = this.props;

    return (!!currentChannel && finalVerifyTop) || (!!currentChannel && DMFinalVerifyTop) ? (
      <ChannelChatFunc
        user={user}
        message={message}
        handleChange={this.handleChange}
        handleSend={this.handleSend}
        messages={messages}
        currentChannel={currentChannel}
        channel={channel}
        modal={modal}
        uploadFile={this.uploadFile}
        openModal={this.openModal}
        toggleModal={this.toggleModal}
        closeModal={this.closeModal}
        newMessageTracker={newMessageTracker}
        hamModalTrack={hamModalTrack}
        ignoreChannel={ignoreChannel}
        handleSearchChange={this.handleSearchChange}
        searchTerm={searchTerm}
        searchResults={searchResults}
        returnMessageInitial={this.returnMessageInitial}
        isPrivateChannel={isPrivateChannel}
        onlineStatus={onlineStatus}
        onlineDectectorById={onlineDectectorById}
        searchResultSetter={this.searchResultSetter}
        channelClearNoti={channelClearNoti}
        handleStar={this.handleStar}
        isChannelStarred={isChannelStarred}
        handleStarMsg={this.handleStarMsg}
        starMsgChecker={this.starMsgChecker}
        isMessageFromChannelStarred={isMessageFromChannelStarred}
        intialSMFC={this.intialSMFC}
        groupCheckSetter={groupCheckSetter}
        groupCheckSetterV2={groupCheckSetterV2}
        dmCheckSetter={dmCheckSetter}
        dmCheckSetterV2={dmCheckSetterV2}
        isChannelPinned={isChannelPinned}
        handlePin={this.handlePin}
        showAYSModal={this.showAYSModal}
        hideAYSModal={this.hideAYSModal}
        areYouSureTracker={areYouSureTracker}
        onKeyDown={this.handleKeyDown}
        onKeypress={this.handleKeyPress}
        displayTypingUsers={this.displayTypingUsers}
        deleteChannelAsAdmin={this.deleteChannelAsAdmin}
        typingUsers={typingUsers}
        isAdmin={isAdmin}
        imagesArray={imagesArray}
        photoIndex={photoIndex}
        isOpen={isOpen}
        imageDetail={imageDetail}
        currentChannelID={currentChannelID}
        currentUser={currentUser}
        componentUpdated={componentUpdated}
        mountedStatus={mountedStatus}
        getAvatarFromUserId={this.retrieveAvatarFromId}
        openLightBoxModal={this.openLightBoxModal}
        closeLightBox={this.closeLightBox}
        moveLightBoxPrev={this.moveLightBoxPrev}
        moveLightBoxNxt={this.moveLightBoxNxt}
        userInView={this.userInView}
        userInViewDesktop={this.userInViewDesktop}
        cCMounted={cCMounted}
        cCMountedAdd={cCMountedAdd}
        cCMountedMinus={cCMountedMinus}
        audioFile={audioFile}
        userPresenceCheckTest={userPresenceCheckTest}
        messagesRef={messagesRef}
        usersRef={usersRef}
        isDesktop={this.props.isDesktop || ""}
        messagesProp={this.props.messages}
        messageKey={messageKey}
        retrieveAvatarFromId={this.retrieveAvatarFromId}
        ref={this.inputFieldRef}
        handleAddEmoji={this.handleAddEmoji}
        handleFocus={this.handleFocus}
        messageTyped={messageTyped}
        searchLoading={searchLoading}
        remountComponentOnNC={remountComponentOnNC}
        remountSetChannel={this.remountSetChannel}
        hasChannelUpdated={hasChannelUpdated}
        setIsProfileAlt={setIsProfileAlt}
        setIsProfile={setIsProfile}
        setIsGroupInfo={setIsGroupInfo}
        remountProfileComponent={remountProfileComponent}
        checkProfileDesktop={this.checkProfileDesktop}
        handleSetIsGroupInfo={handleSetIsGroupInfo}
        groupCheckSetterDesktop={groupCheckSetterDesktop}
        
      />
    ) : (
      <ErrorPage />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
    onlineStatusObject: state.channel.onlineStatus,
    onlineLive: state.channel.onlineLive,
    allNotifications: state.channel.notifications,
    channelNotifications: state.channel.cNotifications,
    starredMsgsFromChannels: state.userInfo.userInfo.starredMsgs,
    usersAvatarPair:state.usersAvatarPair.avatarPair
  };
};

export default withRouter(
  connect(mapStateToProps, {
    setOnlineLive,
    setOnlineStatus,
    setNotification,
    setChannelNotification,
    setUserCurrentlyInView,
    setChannelMessage
  })(ChannelChat)
);
