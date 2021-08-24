import React, { useEffect, useRef, useState, useCallback } from "react";
import { emojis } from "../Utility/emoji_data";

const AboutModalDesktop = React.forwardRef(
  (
    {
      isModal,
      isDesktop,
      modalReverse,
      aboutModalDeactivator,
      handleFocus,
      aboutTyped,
      handleChange,
      isTyping,
      remainingLetter,
      handleTogglePicker,
      handleSave,
      error,
      handleAddEmoji,
      returnInitialAboutMe,
      setIsTyping,
      setCurrentStringIndex,
      aboutMeUnique,
      remountComponentOnNC
    },
    ref
  ) => {
    const modalRef = useRef(null);
    const [isEmoji, setIsEmoji] = useState(false);
    const [isEmpty, setIsEmpty] = useState('');
    const modalPopUp = useRef(null);

    const hideEmoji = () => {
      setIsEmoji(false);
    };

    const toggleEmoji = () => {
      setIsEmoji(!isEmoji);
      setIsEmpty("");
    };

    const handleEmoji = (item) => {
      hideEmoji();
      handleAddEmoji(item);
    };



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

    const modalReverser = useCallback(
      () => {
        returnInitialAboutMe();
        setIsTyping();
        modalReverse();
      },
      [modalReverse, returnInitialAboutMe, setIsTyping]
    );




    useEffect(() => {
      const modal = modalRef.current;

      const handleWindowClick = (event) => {
        if (modal) {
          if (modal.contains(event.target)) {
            return;
          } else {
            if (
              event.target.className ===
                "modal-cl-dialog modal-cl-dialog-centered modal-cl-dialog-zoom" ||
              event.target.className === "modal-cl fade show abmodal"
            ) {
              modalReverser();
            } else {
              return;
            }
          }
        }
      };

      if (isModal) {
        window.addEventListener("click", handleWindowClick);
      } else {
        window.removeEventListener("click", handleWindowClick);
      }
      return () => {
        window.removeEventListener("click", handleWindowClick);
      };
    }, [isModal, modalReverser]);




    useEffect(() => {
      const modal = modalPopUp.current;

      const handleWindowClick = (event) => {
        if (modal) {
          if (modal.contains(event.target)) {
            return;
          } else {
            setIsEmoji(false)
          }
        }
      };

      if (isEmoji) {
        window.addEventListener("click", handleWindowClick);
      } else {
        window.removeEventListener("click", handleWindowClick);
      }
      return () => {
        window.removeEventListener("click", handleWindowClick);
      };
    }, [isEmoji, setIsEmoji]);


    const remainingLetterNew = () => {
      const MAX_STRING = 250;
      const MIN_STRING = 0;
      if (remainingLetter > MIN_STRING && remainingLetter < MAX_STRING) {
        return `| ${remainingLetter} more character${
          remainingLetter > 1 ? "s" : ""
        } left.`;
      }
    };

    const saveNow = (event) => {
      handleSave(event);
      modalReverse();

    };



    useEffect(() => {
      const textarea = ref.current  
      if(textarea) {
        const length = aboutMeUnique.length
        setCurrentStringIndex(length)
        textarea.focus();
        textarea.setSelectionRange(length, length);
      }
    }, [ref, aboutMeUnique, setCurrentStringIndex]);


    const emptyCase = () => {
      setIsEmpty("Empty fields...")
    }

    const setErrorEmpty = () => {
      setIsEmpty("")
    }



    return (
      <>
        <div
          className="modal-cl fade show abmodal"
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
              <div className="modal-cl-header modal--h2">
                <button
                  type="button"
                  className="close button--h2"
                  datadismiss="modal-cl"
                  aria-label="Close"
                  onClick={() => modalReverser()}
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
                <div className="alert alert-info" id={isEmpty && "alert-error"}>{!isEmpty ? <span>Edit About {isTyping && remainingLetterNew()}</span> : isEmpty} </div>
                <form>
                  {isEmoji && (
                    <div
                      className="dropdown-menu dropdown-menu-big p-0"
                      ref={modalPopUp}
                    >
                      <div className="emojis chat-emojis">
                        <ul>
                          {emojis.map((item, index) => (
                            <li key={index} onClick={() => handleEmoji(item)}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      id="message"
                      style={{
                        fontSize: "0.9rem",
                        position: "relative",
                      }}
                      type="text"
                      name="about"
                      autoFocus
                      onFocus={handleFocus}
                      value={aboutTyped}
                      onChange={handleChange}
                      onClick={setErrorEmpty}
                      maxLength="250"
                      required
                      ref={ref}
                    />
                    <span
                      className="amd_face_icon"
                      onClick={() => toggleEmoji()}
                    >
                      <i className="mdi mdi-face"></i>
                    </span>
                  </div>
                </form>
              </div>
              <div className="modal-cl-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={aboutTyped.length?(event) => saveNow(event): () => emptyCase()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop"></div>
      </>
    );
  }
);

export default AboutModalDesktop;
