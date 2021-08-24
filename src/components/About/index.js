import React, { Component } from "react";
import { BiArrowBack } from "react-icons/bi";
import hamburgerCustom from "../../static/img/hamburger.svg";
import { connect } from "react-redux";
import firebase from "../../firebase";
import { HiPencil } from "react-icons/hi";
import { MdCheck } from "react-icons/md";
import AboutHamburgerModal from "../Modal/AboutHamburgerModal";
import AboutModal from "../Modal/AboutModal";
import { statusOptions } from "../Utility/statusOptions";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { shortenFileName } from "../Utility/string_shortener";
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { BsInfoCircle } from "react-icons/bs";
import AboutModalDesktop from "../Modal/AboutModalDesktop";
import BlackRock from "../Themefy/BlackRock";
import { ManeteeSpan } from "../Themefy/ManateeColor";


class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRef: firebase.database().ref("users"),
      hamModalTracker: false,
      statusMatch: false,
      user: this.props.loggedInUser,
      aboutMe: null,
      aboutMeUnique: null, 
      aboutMeModal: false,
      remainingLetter: 0,
      isTyping: false,
      defaultStatus: statusOptions(),
      aboutTyped: "",
      emojiPicker: false,
      currentStringIndex: 0,
      error: '',
      isAboutModal: false
    };

    this.inputFieldRef = React.createRef();
    this.aboutRef = React.createRef();
  }

  componentDidMount() {
    const { user } = this.state;
    if (user) {
      this.retrieveInitialStatus();
      this.setDefaultStatusFrmCookie();
      this.setDefaultStringIndex();

    }
  }

  setCurrentStringIndex = (index) => {
    this.setState({
      currentStringIndex: index
    })
  }



  setIsAboutModal = () => {
    this.setState({
      isAboutModal: true
    })
    
  }

  unSetIsAboutModal = () => {
    this.setState({
      isAboutModal: false
    })
  }


  returnInitialAboutMe = () => {
    this.setState({
      aboutMe: this.state.aboutMeUnique
    })
  }

  setIsTyping = () => {
    this.setState({
      isTyping: false
    })
  }




  handleTogglePicker = (event) => {
    event.preventDefault()
    this.setState({ emojiPicker: !this.state.emojiPicker });

  };

  setDefaultStringIndex = () => {;
    const { aboutMe } = this.state
    if(aboutMe) {
      const aboutMeLen = aboutMe.length
      this.setState({
         currentStringIndex: aboutMeLen
      })
    }
  }

  handleAddEmoji = emoji => {
    const { currentStringIndex } = this.state

    const targetRefValue = this.inputFieldRef.current.value

    const firstPart = targetRefValue.slice(0, currentStringIndex)

    const secondPart = targetRefValue.slice(currentStringIndex)

    const middlePart = emoji.colons

    const fullText  = `${firstPart} ${this.props.isDesktop?emoji:middlePart} ${secondPart}`

    const newAboutTyped = this.colonToUnicode(fullText);

    this.setState({ aboutMe: this.props.isDesktop?fullText:newAboutTyped, emojiPicker: false, currentStringIndex: fullText.length });

    setTimeout(() => this.inputFieldRef.current.focus(), 0);

    
    
  };


  trackCursorPosition = () => {
    const targetRef = this.inputFieldRef.current

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

  handleFocus = (event) => {
    const { aboutMe } = this.state
    this.setState({
      aboutTyped: aboutMe
    }, () => this.trackCursorPosition())
  }


  colonToUnicode = text => {
    return text.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  };

  setDefaultStatusFrmCookie = () => {
    const serializedStatusCookie = () => {
      return JSON.parse(Cookies.get("aboutStatus"));
    };
    if (Cookies.get("aboutStatus") === undefined) {
      return;
    } else {
      this.setState({
        defaultStatus: serializedStatusCookie(),
      });
    }
  };

  retrieveInitialStatus = () => {
    const { user } = this.state;
    if (user) {
      this.state.usersRef
        .child(`${this.state.user.uid}/about`)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            const aboutMe = data.details;
            this.setState({ 
              aboutMe, 
              aboutMeUnique:aboutMe 
            });
          }
        });
    }
  };

  aboutMeUpdater = (aboutMe) => {
    const { user } = this.state;
    if (user) {
      this.state.usersRef.child(`${this.state.user.uid}/about`).update({
        details: aboutMe,
        timeUpdated: firebase.database.ServerValue.TIMESTAMP,
      });

      this.retrieveInitialStatus();
    }
  };

  aboutModalActivator = () => {

    this.setState(
      (previousState) => ({
        aboutMeModal: true,
        displayBottomNav: false
      }),
      () => this.prepareModal()
    );
  };

  prepareModal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.classList.add("stop_scroll");
  };

  UnPrepareModal = () => {
    document.body.classList.remove("stop_scroll");
  };

  aboutModalDeactivator = (event) => {
    event.preventDefault();
    this.setState(
      (previousState) => ({
        displayBottomNav: true,
        aboutMeModal: false,
        isTyping: false,
      }),
      () => this.UnPrepareModal()
    );
  };

  handleChange = (event) => { 
    this.setState(
      {
        aboutTyped: event.target.value,
        isTyping: true,
      },
      () => this.handleAboutTyping()
    );
  };


  handleAboutTyping = () => {
    const { aboutTyped } = this.state;
    const MAX_STRING = 250;
    const stringMax = MAX_STRING;
    const aboutTypedLen = aboutTyped.length;
    const remainingLetter = stringMax - aboutTypedLen;
    this.setState({
      remainingLetter,
      aboutMe: aboutTyped
    });
  };

  
  isInputValid = () => {
    if (this.inputFieldRef.current.value.length < 1) {
      this.setState({
        ...this.state,
        error: "About can't be empty",
      });
      return false;
    } else {
      this.setState({
        ...this.state,
        error: "",
      });
      return true;
    }
  };


  handleSave = (event) => {  
    event.preventDefault();
    const inputValidity = this.isInputValid()

    if(inputValidity){
      const { user, aboutMeUnique, usersRef, aboutTyped, defaultStatus } = this.state;
      let duplicateItem = []

      if (aboutMeUnique && aboutTyped) {
        let trimmedAboutTyped = aboutTyped.replace(/\s\s+/g, " ").trim();
        let statusOption = defaultStatus;

        if (aboutMeUnique.trim() !== trimmedAboutTyped) {
          
          statusOption.map((item) => {
            if(item.text === trimmedAboutTyped) {
               duplicateItem.push(item)
            }
            return duplicateItem;
           
          })

          if(duplicateItem.length > 0){
            this.setState({
              aboutMeUnique: trimmedAboutTyped,
            });

            if (user) {
              usersRef.child(`${user.uid}/about`).update({
                details: trimmedAboutTyped,
                timeUpdated: firebase.database.ServerValue.TIMESTAMP,
              });
            }
          }else{
              let newCustomStatus = {
                key: uuidv4(),
                text: trimmedAboutTyped,
              };

              defaultStatus.unshift(newCustomStatus);
              Cookies.set("aboutStatus", defaultStatus, { expires: 365 });
              // do something about the aboutMeUnique
              this.setState({
                aboutMeUnique: trimmedAboutTyped,
              });

              if (user) {
                usersRef.child(`${user.uid}/about`).update({
                  details: trimmedAboutTyped,
                  timeUpdated: firebase.database.ServerValue.TIMESTAMP,
                });
              }
          }


        }
      }

      this.aboutModalDeactivator(event);
    }else{
      // if input is "empty"
      // after 2 seconds ( = 2000ms), set error to an empty state.
      setTimeout(() => this.setState({ ...this.state, error: "" }), 2000);
      return;
    }


    
  };

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.usersRef.off();
  };

  addHamModal = () => {
    this.setState({
      hamModalTracker: true,
    });
  };

  removeHamModal = () => {
    this.setState({
      hamModalTracker: false,
    });
  };

  render() {
    const {
      hamModalTracker,
      aboutMe,
      aboutMeModal,
      remainingLetter,
      isTyping,
      aboutTyped,
      defaultStatus,
      emojiPicker,
      error,
      isAboutModal,
      aboutMeUnique
    } = this.state;

    const { goBack, setBottomNavActive, setBottomNavInactive, theme } = this.props;
    return (
      <>
        {hamModalTracker ? (
          <AboutHamburgerModal
            goBack={this.removeHamModal}
            removeHamModal={goBack}
            ref={this.aboutRef}
          />
        ) : (
          ""
        )}

        <div className="about-container">
          {!this.props.isDesktop && aboutMeModal && (
            <>
              {emojiPicker && (
                <Picker set="apple" className="emojipicker" emoji="point_up" onSelect={this.handleAddEmoji} />
              )}
               <AboutModal 
                  aboutModalDeactivator={this.aboutModalDeactivator}
                  handleFocus={this.handleFocus} 
                  aboutTyped= {aboutTyped}
                  handleChange={this.handleChange}
                  isTyping={isTyping}
                  remainingLetter={remainingLetter} 
                  handleTogglePicker={this.handleTogglePicker}
                  handleSave={this.handleSave}
                  ref={this.inputFieldRef}
                  trackCursorPosition={this.trackCursorPosition}
                  setDefaultStringIndex={this.setDefaultStringIndex}
                  error={error}
                  setBottomNavActive={setBottomNavActive}
                  setBottomNavInactive={setBottomNavInactive}
               />
            </>
          )}

          {this.props.isDesktop && isAboutModal &&
            <AboutModalDesktop 
              setIsAboutModal={this.setIsAboutModal} 
              modalReverse={this.unSetIsAboutModal}
              isDesktop={this.props.isDesktop}
              isModal={isAboutModal}
              aboutModalDeactivator={this.setIsAboutModal}
              handleFocus={this.handleFocus} 
              aboutTyped= {aboutTyped}
              handleChange={this.handleChange}
              isTyping={isTyping}
              remainingLetter={remainingLetter} 
              handleTogglePicker={this.handleTogglePicker}
              handleSave={this.handleSave}
              ref={this.inputFieldRef}
              trackCursorPosition={this.trackCursorPosition}
              setDefaultStringIndex={this.setDefaultStringIndex}  
              handleAddEmoji={this.handleAddEmoji}
              returnInitialAboutMe={this.returnInitialAboutMe}
              setIsTyping={this.setIsTyping}
              setCurrentStringIndex={this.setCurrentStringIndex}
              aboutMeUnique={aboutMeUnique}
              error={error}
            />
          }
          <BlackRock className="status channel-status profile-status white-background">
            <div className="add_status channel-nav profile-nav">
              <div className="channel-nav--1">
                <div className="add_status--right" onClick={goBack}>
                  <BiArrowBack className="hamModal--backItem" />
                </div>
                <div className="add_status--left">
                  <ManeteeSpan as="p" className="add_status--header profile-header">About</ManeteeSpan>
                </div>
              </div>
              <div className="channel-nav--2" onClick={this.addHamModal}>
                <img src={hamburgerCustom} className="hamburger" alt="" />
              </div>
            </div>

            <div className="all--section rem_padder">
              <section className="about--section1" id={theme === "dark"?"margin_top--1":null}>
                <div className="about--header">Currently set to</div>
                <div
                  className="about--flex"
                  onClick={this.props.isDesktop? () => this.setIsAboutModal() : () => this.aboutModalActivator()}
                >
                  <ManeteeSpan as="div" className="about--text">{aboutMeUnique && aboutMeUnique}</ManeteeSpan>
                  <ManeteeSpan as="div">
                    <HiPencil className="about--pencil" />
                  </ManeteeSpan>
                </div>
              </section>

              <hr className="hr" />

              <section className="about--section2">
                <div className="about--header">Select About</div>
                <div className="about--flex2">
                  {defaultStatus.map((item) => (
                    <div
                      key={item.key}
                      className="about--flex2Item"
                      onClick={() => this.aboutMeUpdater(item.text)}
                    >
                      <ManeteeSpan as="div" className="about--text">
                        {shortenFileName(item.text, 45, 0.99, "...")}
                      </ManeteeSpan>
                      {item.text === aboutMe && (
                        <div>
                          <MdCheck className="about--check" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="about--section3">
                <div className="about--header">Disclaimer</div>
                <div className="about--flex2">
                   
                </div>
                <div className="accept_ignore--instructions new_instructions">
                  <div className="accept_ignore--icon">
                    <BsInfoCircle className="accept_ignore--iconItem" />
                  </div>
                  <div className="accept_ignore--text">
                    Your total star counts will be shown to anyone who views your
                    profile. By default, this is "turned on" to allow other users
                    track your active social pace. 
                  </div>
                </div>
              </section>
            </div>
          </BlackRock>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.user.currentUser,
  theme: state.theme.color
});

export default connect(mapStateToProps)(About);
