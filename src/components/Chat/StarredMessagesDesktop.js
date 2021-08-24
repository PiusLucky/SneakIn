import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "../../firebase";
import Button from "../Button";
import Swipe from "../Swipe";
import SwipeMsg from "../Swipe/SwipeMsg";
import loading_svg from "../../static/img/loading/loading.svg";
import NoStarred from "../404/NoStarred";
import StarSwitcher from "../Themefy/StarSwitcher";
import getSortedData from "../Utility/getSortedData";


class StarredMsgsDesktop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joined: "",
      usersRef: firebase.database().ref("users"),
      channelsRef: firebase.database().ref("channels"),
      channelCount: 0,
      starCount: 0,
      starredChannels: [],
      starredMFChannels: [],
      hamModalTracker: false,
      showEditDiv: false,
      channelType: true,
    };
  }

  componentDidMount() {
    const user = this.props.currentUser;
    const { usersRef, channelsRef, starredChannels } = this.state;
    if (user) {
      usersRef
        .child(user.uid)
        .child("starred")
        .once("value")
        .then((data) => {
          if (data.val() !== null) {
            const channelIds = Object.keys(data.val());
            const starCount = channelIds.length;
            channelIds.length > 0 &&
              channelIds.map((id) => {
                channelsRef.child(id).once("value", (snap) => {
                  const channelObject = snap.val();
                  starredChannels.push(channelObject);
                });
                return starredChannels;
              });
            this.setState({ starCount });
          }
        });

      this.allMessagesExtractor();
      this.switchToMsg();
      this.sortedData();
    }
  }

  retrieveAvatarFromId = (id) => {
    const { usersAvatarPair } = this.props;
    if (usersAvatarPair) {
      const itemSpecific = usersAvatarPair.filter((item) => item.id === id);
      if (itemSpecific.length > 0) {
        const avatar = itemSpecific[0].avatar;
        return avatar;
      }
    }
    return loading_svg;
  };

  indexFinder = (arr, starredChn) => {
    let newArray = arr.filter((item) => item !== null);
    let index = newArray.findIndex((item) => item.id === starredChn.id);
    const indexCount = index + 1;
    const arrLength = newArray.length;
    return `${indexCount}/${arrLength}`;
  };

  channelSwitcher = (currentType) => {
    this.setState({
      channelType: !currentType,
    });
  };

  sortedData = () => {
    const { starredMFChannels } = this.state;
    if(starredMFChannels) {
      const prop = "timeStarred";
      const sortedMFChannels = getSortedData(starredMFChannels, prop)
      this.setState({
        starredMFChannels: sortedMFChannels
      })
    }

  };

  allMessagesExtractor = () => {
    const Obj = this.props.starredMsgsFromChannels;
    const { starredMFChannels } = this.state;
    if (Obj) {
      const starredObj = Object.entries(Obj);
      starredObj.map((starredItem) => {
        starredMFChannels.push(starredItem[1]);
        starredItem[1]["id"] = starredItem[0];
        return starredMFChannels;
      });
    }
  };

  switchToMsg = () => {
    const { channelType, starredChannels, starredMFChannels } = this.state;
    if (starredChannels.length === 0 && starredMFChannels.length > 0) {
      this.setState({
        channelType: !channelType,
      });
    }
  };

  componentWillUnmount() {}

  render() {
    const { starredChannels, starredMFChannels, channelType } = this.state;

    return starredChannels.length > 0 || starredMFChannels.length > 0 ? (
      <StarSwitcher className="status channel-status profile-status rem_padder relative_adder">
        {starredChannels.length > 0 || starredMFChannels.length > 0 ? (
          <div className="star--topBtn adder_child">
            <Button
              className="star--topBtnItem"
              channelSwitcher={this.channelSwitcher}
              channelType={channelType}
            />
          </div>
        ) : null}

        {channelType ? (
          <Swipe
            swipeArray={starredChannels}
            indexFinder={this.indexFinder}
            getAvatarFromUserId={this.retrieveAvatarFromId}
          />
        ) : (
          <SwipeMsg
            swipeArray={starredMFChannels}
            indexFinder={this.indexFinder}
            getAvatarFromUserId={this.retrieveAvatarFromId}
          />
        )}
      </StarSwitcher>
    ) : (
      <NoStarred />
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  starredMsgsFromChannels: state.userInfo.userInfo.starredMsgs,
  usersAvatarPair: state.usersAvatarPair.avatarPair,
});

export default connect(mapStateToProps)(StarredMsgsDesktop);
