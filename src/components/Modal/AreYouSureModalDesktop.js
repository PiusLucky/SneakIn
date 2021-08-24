import React, { useEffect, useRef } from "react";

const AreYouSureModalDesktop = (props) => {
    const {
      channelName,
      hideAYSModal,
      isAdmin,
      isPrivateChannel,
      removeSomeoneFromChat,
      removeYourselfFromChannel,
      deleteChannelAsAdmin,
      isDesktop,
      areYouSureTracker,
    } = props;

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
        if (modal) {
          if (modal.contains(event.target)) {
            return;
          } else {
            if (
              event.target.className === "modal-cl fade show" ||
              event.target.className ===
                "modal-cl-dialog modal-cl-dialog-centered modal-cl-dialog-zoom"
            ) {
              hideAYSModal(event);
            } else {
              return;
            }
          }
        }
      };

      if (areYouSureTracker) {
        window.addEventListener("click", handleWindowClick);
      } else {
        window.removeEventListener("click", handleWindowClick);
      }
      return () => {
        window.removeEventListener("click", handleWindowClick);
      };
    }, [areYouSureTracker, hideAYSModal]);

    return (
      <>
        <div
          className="modal-cl fade show"
          id="areYouSureModalDesktop"
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
                  Are You Sure?
                </h5>
                <button
                  type="button"
                  className="close"
                  datadismiss="modal-cl"
                  aria-label="Close"
                  onClick={(event) => hideAYSModal(event)}
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
              <div className="modal-cl-body">
                <form>
                  <div className="form-group">
                    This operation cannot be undone. Clicking "continue"&nbsp;
                    {isPrivateChannel ? (
                      <span>
                        removes <em className="themefy">{channelName}'s</em> from your DMs Tab.
                        Please, be careful while deleting a chat because
                        <span className="redify">
                          {" "}
                          you cannot access this user anymore
                        </span>{" "}
                        until you initialize a new connection from your end. We
                        take <span className="redify">
                          Two-Way connection
                        </span>{" "}
                        seriously for security purposes
                      </span>
                    ) : isAdmin ? (
                      <span>
                        deletes the channel (<em className="themefy">{channelName}</em>) completely
                      </span>
                    ) : (
                      <span>
                        removes you from <em className="themefy">{channelName}'s</em> channel
                      </span>
                    )}
                    , do you intend to proceed?
                  </div>
                  <div>
                    <span className="redify">
                     {isAdmin? "Action: [Messages, Images, Sticker/Emojis, all other channel data will be deleted permanently!]"
                     :
                     `Action: Exiting will render you inaccessible to this ${!isPrivateChannel?"channel":"User"}, 
                     you can ${!isPrivateChannel?"rejoin":"re-create a connection"} using the ${!isPrivateChannel?"channels":"DM's"} panel on the left.`
                     }
                     </span>
                  </div>
                  <div className="modal-cl-footer">
                    <div className="modal-cl-footer">
                        <div
                          className="accept_ignore--btn1"
                          onClick={(event) => hideAYSModal(event)}
                        >
                          Cancel
                        </div>
                        <div
                          className="accept_ignore--btn2"
                          onClick={
                            isPrivateChannel
                              ? () => removeSomeoneFromChat()
                              : isAdmin
                              ? deleteChannelAsAdmin
                              : () => removeYourselfFromChannel()
                          }
                        >
                          Proceed
                        </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop" onClick={(event) => hideAYSModal(event)}></div>
      </>
    )
}

export default AreYouSureModalDesktop;
