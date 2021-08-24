import React, { Component } from "react";
import { BiArrowBack } from "react-icons/bi";
import hamburgerCustom from "../../static/img/hamburger.svg";
import { connect } from "react-redux";
import firebase from "../../firebase";
import ProfileHamburgerModal from "../Modal/ProfileHamburgerModal";
import Button from "../Button";
import Swipe from "../Swipe";
import SwipeMsg from "../Swipe/SwipeMsg";
import { setActiveComponent } from "../../actions";
import { statusObject } from "../Utility/statusOptions";
import getSortedData from "../Utility/getSortedData";


class StarredMsgs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
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
      

    this.starRef = React.createRef();


  }

  // calculations
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


      const newObj = {
        ...statusObject,
        starCheckTrack: true
      }
      this.props.setActiveComponent(newObj);

    }
  }

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

  addHamModal = () => {
    this.setState({
      hamModalTracker: true,
    });
  };

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

  removeHamModal = () => {
    this.setState({
      hamModalTracker: false,
    });
  };

  indexFinder = (arr, starredChn) => {
    let newArray = arr.filter(item => item !== null)
    let index = newArray.findIndex((item) => item.id === starredChn.id);
    const indexCount = index + 1;
    const arrLength = newArray.length;
    return `${indexCount}/${arrLength}`;
  };

  channelSwitcher = (currentType) => {
    this.setState({
      channelType: !currentType 
    })
  }

  allMessagesExtractor = () => {
    const Obj = this.props.starredMsgsFromChannels
    const { starredMFChannels } = this.state
    if(Obj){
      const starredObj = Object.entries(Obj);
      starredObj.map((starredItem) => {
        starredMFChannels.push(starredItem[1])
        starredItem[1]["id"] = starredItem[0] 
        return starredMFChannels;
      });
    }
  };

  switchToMsg = () => {
   /* 
   It toggles the channelType boolean if the starredChannels Array
   is empty but at least one item is present in the starredMFChannels Array
   */
   const { channelType, starredChannels, starredMFChannels } = this.state
   if(starredChannels.length === 0 && starredMFChannels.length > 0) {
     this.setState({
       channelType: !channelType
     })
   }
  }

  componentWillUnmount() {
    const newObj = {
      ...statusObject,
      starCheckTrack: false
    }
    this.props.setActiveComponent(newObj);
  }

  render() {
    
    const {
      hamModalTracker,
      showEditDiv,
      starredChannels,
      starredMFChannels,
      channelType
    } = this.state;

    const {
      goBack,
      groupCheckSetter,
      dmCheckSetter
    } = this.props;

    

    return (
      <>
        {hamModalTracker ? (
          <ProfileHamburgerModal
            goBack={this.removeHamModal}
            groupCheckSetter={groupCheckSetter}
            dmCheckSetter={dmCheckSetter}
            showEditDiv={showEditDiv}
            removeHamModal={goBack}
            hamModalTracker={hamModalTracker}
            ref={this.starRef}
          />
        ) : (
          ""
        )}

        <div className="status channel-status profile-status rem_padder">
          <div className="add_status channel-nav profile-nav">
            <div className="channel-nav--1">
              <div className="add_status--right" onClick={goBack}>
                <BiArrowBack className="hamModal--backItem" />
              </div>
              <div className="add_status--left">
                <p className="add_status--header profile-header">All Starred</p>
              </div>
            </div>
            <div className="channel-nav--2" onClick={this.addHamModal}>
              <img src={hamburgerCustom} className="hamburger" alt="" />
            </div>
          </div>

          {starredChannels.length > 0 || starredMFChannels.length > 0 ?
          <div className="star--topBtn">
            <Button className="star--topBtnItem" channelSwitcher={this.channelSwitcher}  channelType={channelType} />
          </div>
          :
          null
          }

          {channelType?
        
           <Swipe swipeArray={starredChannels} indexFinder={this.indexFinder} getAvatarFromUserId={this.getAvatarFromUserId} />
          :
           <SwipeMsg swipeArray={starredMFChannels} indexFinder={this.indexFinder} getAvatarFromUserId={this.getAvatarFromUserId}  />
           
          }


  

        </div>
    </>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  starredMsgsFromChannels: state.userInfo.userInfo.starredMsgs,
});

export default connect(mapStateToProps, { setActiveComponent })(StarredMsgs);