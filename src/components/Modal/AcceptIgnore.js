import React, { Component } from "react";
import { BsInfoCircle, BsCheckCircle } from 'react-icons/bs';
import { connect } from "react-redux";
import { TiGroup } from "react-icons/ti";
import moment from 'moment';
import { shortenFileName } from '../Utility/string_shortener'
import firebase from "../../firebase";
import {
  setCurrentChannel
} from "../../actions";

// verifyCrooner
class AcceptIgnore extends Component {
    state = {
      channelsRef: firebase.database().ref("channels"),
    };

    componentDidMount() {
      this.checkVerifyStatus();
    }

    componentWillUnmount() {
      this.state.channelsRef.off();
    }

    checkVerifyStatus = () => {
      const {currentUser, currentChannel, verifyCrooner} = this.props
      if(currentUser && currentChannel){
         this.state.channelsRef
           .child(currentChannel.id)
           .once("value", (collection_data) => {
           const channel_data = collection_data.val();
           const existing_users_ids = channel_data.suscribed_users && channel_data.suscribed_users.users_id;
           if (existing_users_ids && existing_users_ids.includes(currentUser.uid)) {
             verifyCrooner()  
           }
         }); 
      }

    }

    ignoreNow = () => {
      this.props.ignore();
      this.props.setCurrentChannel(null);
    }
    

    render() {
        const {currentChannel, accept} = this.props
        const channel_name = currentChannel.name
        const channel_members_count = currentChannel.suscribed_users ? currentChannel.suscribed_users.users_id.length : 0
        const channel_timestamp = moment(currentChannel.createdBy.timestamp).format("L")
        return (
            <>      
             <div className="accept_ignore">
                 <div className="accept_ignore--modal">
                     <p className="accept_ignoreHeader">
                     <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1" 
                          viewBox="0 0 48 48" enableBackground="new 0 0 48 48"
                          height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <circle fill="darkseagreen" cx="24" cy="24" r="21"></circle>
                          <polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 
                          21,33.8 37.4,17.4">
                          </polygon>
                      </svg>&nbsp;Confirm</p>
                     <div className="accept_ignore--littlebox">
                         <div className="accept_ignore--details">
                             <div className="accept_ignore--details1">
                                 {shortenFileName(channel_name, 30, .99, '...' )}
                             </div>
                             <div className="accept_ignore--details2">
                                 { channel_timestamp }
                             </div>
                         </div>
                         <div className="accept_ignore--img">
                             <TiGroup className="add_status--icon accept_ignore--imgItem" />
                         </div>
                     </div>

                     <div className="accept_ignore--instructions">
                         <div className="accept_ignore--icon">
                             <BsInfoCircle className="accept_ignore--iconItem"/>
                         </div>
                         <div className="accept_ignore--text">
                             Clicking the "accept" button adds you to <span className="themefy">{channel_name}</span> channel's list of suscribed users. 
                         </div>
                     </div>

                     <hr className="accept_ignore--hr" />
                     
                     <div className="accept_ignore--stats">
                         <div className="accept_ignore--stats1">
                             Channel members
                         </div>
                         <div className="accept_ignore--stats2">
                             <BsCheckCircle />&nbsp;&nbsp;{channel_members_count}
                         </div>
                     </div>

                     <div className="accept_ignore--btn">
                         <div className="accept_ignore--btn1" onClick={() => this.ignoreNow()}>
                             Ignore
                         </div>
                         <div className="accept_ignore--btn2" onClick={accept}>
                             Accept
                         </div>
                     </div>
                 </div>
             </div>
            </>
        );
    }
}



const mapStateToProps = (state) => {
  return {
    currentChannel: state.channel.currentChannel,
  };
};

export default connect(mapStateToProps, {setCurrentChannel})(AcceptIgnore)
