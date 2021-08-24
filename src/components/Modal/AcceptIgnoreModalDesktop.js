import React, { useEffect, useRef } from "react";
import { BsInfoCircle, BsCheckCircle } from 'react-icons/bs';
import { connect } from "react-redux";
import { TiGroup } from "react-icons/ti";
import moment from 'moment';
import { shortenFileName } from '../Utility/string_shortener'
import {
  setCurrentChannel
} from "../../actions";


const AcceptIgnoreModalDesktop = ({ isAIModal, isDesktop, AIModalReverseAlt, currentChannel, ignore, accept, setCurrentChannel, AIModalReverseAltNoReload, generateCSP }) => {
    const modalRef = useRef(null);
    useEffect(() => {
        if (isDesktop) {
            document.body.classList.add("modal-cl-open");
        } else {
            document.body.classList.remove("modal-cl-open");
        }
        return () => {
            document.body.classList.remove("modal-cl-open");
        };
    }, [isDesktop]);

    useEffect(() => {
        const modal = modalRef.current;
        const handleWindowClick = (event) => {
            if (modal !== null) {
                if (modal.contains(event.target)) {
                    return;
                } else { 
                    if(event.target.className === "modal-cl fade show") {
                       AIModalReverseAlt()
                    }else{
                       return;
                    }
                }
            }
        };

        if (isAIModal) {
            window.addEventListener("click", handleWindowClick);
        } else {
            window.removeEventListener("click", handleWindowClick);
        }
        return () => {
            window.removeEventListener("click", handleWindowClick);
        };
    }, [isAIModal, AIModalReverseAlt]);

    const ignoreNow = () => {
      AIModalReverseAlt();
    } 

    const acceptNow = () => {
      accept();
      generateCSP();
      AIModalReverseAltNoReload();
    }
    
    const channel_name = currentChannel?currentChannel.name:""
    const channel_members_count = currentChannel?currentChannel.suscribed_users && currentChannel.suscribed_users.users_id.length:""
    const channel_timestamp = currentChannel?moment(currentChannel.createdBy.timestamp).format("L"):""

    return (

        <>
            <div
                className="modal-cl fade show"
                id="addFriends"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="modal-cl-dialog modal-cl-dialog-centered modal-cl-dialog-zoom"
                    role="document"
                >
                    <div className="modal-cl-content" ref={modalRef}>
                        <div className="modal-cl-header">
                            <h5 className="modal-cl-title">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-users mr-2"
                                >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                Join Channel
                            </h5>
                            <button
                                type="button"
                                className="close"
                                datadismiss="modal-cl"
                                aria-label="Close"
                                onClick={() => AIModalReverseAlt()}
                            >
                                <svg
                                    stroke="currentColor"
                                    className="ti-close"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 512 512"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="32"
                                        d="M368 368L144 144m224 0L144 368"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-cl-body modal-cl-body_b">
                            <div className="alert alert-info">
                                Don't miss out on this channel's trend.
                            </div>
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
                                    
                                    <div className="accept_ignore--stats">
                                        <div className="accept_ignore--stats1">
                                            Channel members
                                        </div>
                                        <div className="accept_ignore--stats2">
                                            <BsCheckCircle />&nbsp;&nbsp;{channel_members_count}
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                        <div className="modal-cl-footer">
                            <div className="accept_ignore--btn">
                                <div className="accept_ignore--btn1" onClick={() => ignoreNow()}>
                                    Ignore
                                </div>
                                <div className="accept_ignore--btn2" onClick={() => acceptNow()}>
                                    Accept
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="modal-backdrop"
                onClick={() => AIModalReverseAlt()}
            ></div>
        </>
    );
};


export default connect(null, {setCurrentChannel})(AcceptIgnoreModalDesktop)
