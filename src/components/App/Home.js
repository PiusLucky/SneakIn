import React, { Component, useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import "../../static/css/style.css";
import "../../static/css/responsive.css";
import sneakin_right_arrow from "../../static/img/sneakin_right_arrow.svg";
import Code from "../Code";
import { getIn, getOut } from "../Utility/animate";
import { useIntersection } from "react-use";
import { CgLogOff } from "react-icons/cg";
import { ImEllo } from "react-icons/im";
import firebase from "../../firebase";
import Skeleton from "react-loading-skeleton";
import { MdFingerprint } from "react-icons/md";
import { Helmet } from "react-helmet";
import md5 from "md5";
import Preloader from "../Preloader";
import * as ROUTES from "../../constants/routes";
import { withRouter } from "react-router";
import { useMediaQuery } from "react-responsive";
import { setCurrentTheme } from "../../actions";
import { ThemeProvider } from "styled-components";
import lightTheme from "../../themes/light";
import darkTheme from "../../themes/dark";
import { Footer } from "../Themefy/CustomTheme";


const HomeAnimate = ({ state, avatar, signOut }) => {
  var homeIllustration = useRef(null);
  const [showImg, setShowImg] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [url, setUrl] = useState("");
  const intersection = useIntersection(homeIllustration, {
    root: null,
    rootMargin: "0px",
    threshold: 0.4,
  });

  useEffect(() => {
    if (avatar) {
      setUrl(avatar);
      window.scrollTo({ top: 0 });
    }
  }, [avatar]);

  if (!!homeIllustration && !!intersection) {
    intersection && intersection.isIntersecting
      ? getIn(".getIn")
      : getOut(".getIn");
  }

  const urlLoad = () => {
    setShowImg(true);
    setImageLoaded(true);
  };

  const isDesktop = useMediaQuery({
    query: "(min-width: 1201px)",
  });

  const themeMode = () => {
    return isDesktop
      ? state.theme === "light"
        ? lightTheme
        : darkTheme
      : lightTheme;
  };

  return (
    <>
      <ThemeProvider theme={themeMode()}>
        <Helmet>
          <meta charSet="UTF-8" />
          <title>Home | SneakIn.app</title>
          <link rel="canonical" href="http://sneaker-chat-app.vercel.app/" />
        </Helmet>
        <div className="main_container">
          <div className="main_container--dimmer">
            <span className="top_liner"></span>
            <div className="desktop-logout">
              <span className="desktop-logout--btn" onClick={signOut}>
                <CgLogOff className="iconOff" /> SignOut
              </span>
            </div>
            <div className="container home_row_flexer container-desktop container-desktop--home">
              <div className="top_section">
                <div className="home">
                  <CgLogOff className="sidebar__icons" onClick={signOut} />
                </div>
                <div className="position_middle">
                  <div className="site_name">
                    Sneak<span className="site_name--in">In</span>
                  </div>
                </div>

                <div className="arrow">
                  <a href="/chat">
                    <img src={sneakin_right_arrow} alt="arrow icon" />
                  </a>
                </div>
              </div>
              <div
                className={
                  url
                    ? imageLoaded
                      ? "text"
                      : "text mr-t-10"
                    : "text four_remer"
                }
              >
                {state.uid === "****" ? (
                  <div className="text__skeleton">
                    <Skeleton circle={true} height={80} width={80} />
                  </div>
                ) : (
                  <div className={showImg ? "text__img--container" : ""}>
                    <img
                      src={state.photoURL ? state.photoURL : url}
                      onLoad={() => urlLoad()}
                      className="text__img--container--img"
                      alt=""
                    />
                  </div>
                )}

                <p className="text__01">
                  Hi{" "}
                  <span role="img" aria-label="bye-emoji">
                    👋
                  </span>{" "}
                  there, welcome to SneakIn.
                </p>
                <p className={url ? "text__02" : "text__02 two_remer"}>
                  Do sneak on your loved ones today and make them happy!{" "}
                </p>
                <div className="button">
                  <a href="/chat" className="link_underline_rmv">
                    <span className="button__item">
                      <ImEllo className="iconChat" />
                      &nbsp;Start Chatting!
                    </span>
                  </a>
                </div>

                <div className="data">
                  {!isDesktop ? (
                    <span className="data--text data--code centralize">
                      &nbsp;&nbsp;Pulled data&nbsp;&nbsp;
                    </span>
                  ) : (
                    <b className="data--text">
                      Your{" "}
                      <span className="data--code">
                        &nbsp;&nbsp;data&nbsp;&nbsp;
                      </span>{" "}
                      is securely saved!
                    </b>
                  )}
                </div>
                <div className="user_info getIn">
                  {state.uid === "****" ? (
                    <Skeleton count={10} />
                  ) : (
                    <Code state={state} avatar={avatar} />
                  )}
                </div>
                <div ref={homeIllustration}>
                  <span className="targetText">
                    ***Data displayed for experimental purposes.***
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer className="bottom_filler">
          <MdFingerprint className="bottom_filler--emojiItem" />
          <span>Pius Lucky (2021)</span>
        </Footer>
      </ThemeProvider>
    </>
  );
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "****",
      displayName: "****",
      photoURL: "",
      email: "****",
      creationTime: "****",
      lastSignInTime: "****",
      newAvatar: "",
      isPreloading: true,
    };
  }

  stateManager = (loggedInUser) => {
    const avatar = `http://gravatar.com/avatar/${
      loggedInUser && md5(loggedInUser.email)
    }?d=identicon`;
    return this.setState({
      user: loggedInUser,
      uid: loggedInUser ? loggedInUser.uid : "",
      photoURL: loggedInUser ? loggedInUser.photoURL : avatar,
      displayName: loggedInUser ? loggedInUser.displayName : "",
      email: loggedInUser ? loggedInUser.email : "",
      creationTime: loggedInUser ? loggedInUser.metadata.creationTime : "",
      lastSignInTime: loggedInUser ? loggedInUser.metadata.lastSignInTime : "",
      newAvatar: avatar,
      theme: localStorage.getItem("theme") || "light",
    });
  };

  //This runs once after the page loads upon sigin/register.
  componentDidMount() {
    const props = this.props;
    const loggedInUser = props.loggedInUser;
    document.body.classList.remove("fix_body");
    if (loggedInUser !== null) {
      this.stateManager(loggedInUser);
    }
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      this.setState(
        {
          theme: localTheme,
        },
        () => this.props.setCurrentTheme(localTheme)
      );
      this.props.setCurrentTheme(localTheme);
    } else {
      const defaultTheme = "dark";
      this.setState(
        {
          theme: defaultTheme,
        },
        () => this.props.setCurrentTheme(defaultTheme)
      );
      this.props.setCurrentTheme(defaultTheme);
      localStorage.setItem("theme", defaultTheme);
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  //This runs on subsequent refreshing of the page
  componentDidUpdate(prevProps, prevState) {
    const props = this.props;
    if (prevProps !== props) {
      const loggedInUser = props.loggedInUser;
      if (loggedInUser !== null) {
        this.stateManager(loggedInUser);
      }
    }
  }

  signOut = () => {
    firebase.auth().signOut();
    this.props.history.push(ROUTES.LOGIN);
  };

  render() {
    const newAvatar = this.state.newAvatar;
    if (!this.props.loggedInUser) {
      return <Preloader />;
    }
    return (
      <HomeAnimate
        state={{ ...this.state }}
        avatar={newAvatar}
        signOut={this.signOut}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.user.currentUser,
});

export default withRouter(connect(mapStateToProps, { setCurrentTheme })(Home));
