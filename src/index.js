import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import * as ROUTES from "./constants/routes";
import Home from "./components/App/Home";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Chat from "./components/Chat/Chat";
import Firebase from "./firebase";
import { setUser, clearUser, setOnlineLive, setUserInfo } from "./actions";
import rootReducer from "./reducers";
import md5 from "md5";
import firebase from "./firebase";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  state = {
    lastLoginRef: firebase.database().ref("lastLogin"),
    connectedRef: firebase.database().ref(".info/connected"),
    lastOnlineRef: firebase.database().ref("lastOnlinePresence"),
    presenceRef: firebase.database().ref("presence"),
    usersRef: firebase.database().ref("users"),
  };

  componentDidMount() {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setInitialStatus(user);
        this.props.setUser(user);
        const currentUserUid = user.uid;
        const {
          connectedRef,
          presenceRef,
          lastOnlineRef,
          usersRef,
        } = this.state;

        connectedRef.on("value", (snap) => {
          if (snap.val() === true) {
            const ref = presenceRef.child(currentUserUid);
            ref.set(true);
            lastOnlineRef.child(currentUserUid).onDisconnect().set({
              last_seen: firebase.database.ServerValue.TIMESTAMP,
            });
            ref.onDisconnect().remove((err) => {
              if (err !== null) {
                console.error(err);
              }
            });
          }
        });

        presenceRef.on("value", (snap) => {
          this.props.setOnlineLive(snap.val());
        });

        usersRef.child(`${user.uid}/name`).on("value", (snapshot) => {
          const data = snapshot.val();
          const userName = user.displayName;
          if (data === null) {
            this.state.usersRef.child(`${user.uid}/name`).set(userName);
          }
        });

        usersRef.child(`${user.uid}/avatar`).on("value", (snapshot) => {
          const data = snapshot.val();
          const avatar = `http://gravatar.com/avatar/${md5(
            user.email
          )}?d=identicon`;
          if (data === null) {
            user.updateProfile({
              photoURL: avatar,
            });
            usersRef.child(`${user.uid}/avatar`).set(avatar);
          }
        });

        usersRef.child(`${user.uid}`).on("value", (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            this.props.setUserInfo(data);
          }
        });

        const userSpecificData = {
          id: user.uid,
          creationTime: user.metadata.creationTime,
        };

        usersRef.child(`${user.uid}`).on("value", (snapshot) => {
          const data = snapshot.val();

          if (data !== null) {
            if (data.hasOwnProperty("userRawData") === false) {
              usersRef.child(`${user.uid}/userRawData`).set(userSpecificData);
            }
          }
        });
      } else {
        if (
          this.props.history.location.pathname === "/login" ||
          this.props.history.location.pathname === "/chat" ||
          this.props.history.location.pathname === "/"
        ) {
          this.props.history.push(ROUTES.LOGIN);
        }

        if (this.props.history.location.pathname === "/register") {
          this.props.history.push(ROUTES.REGISTER);
        }

        this.props.clearUser();
      }
    });
  }

  setInitialStatus = (user) => {
    const defaultAbout = "Hi there, I am using SneakIn.";
    this.state.usersRef.child(`${user.uid}/about`).on("value", (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        this.state.usersRef.child(`${user.uid}/about`).update({
          details: defaultAbout,
          timeUpdated: firebase.database.ServerValue.TIMESTAMP,
        });
      }
    });
  };

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.presenceRef.off();
    this.state.connectedRef.off();
    this.state.lastOnlineRef.off();
    this.state.usersRef.off();
  };

  render() {
    return (
      <>
        <Switch>
          <Route exact path={ROUTES.HOME} component={Home} />
          <Route path={ROUTES.LOGIN} component={Login} />
          <Route path={ROUTES.REGISTER} component={Register} />
          <Route exact path={ROUTES.CHAT} component={Chat} />
        </Switch>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    isLoading: state.user.isLoading,
    currentChannel: state.channel.currentChannel,
  };
};

const RootWithAuth = withRouter(
  connect(mapStateToProps, { setUser, clearUser, setOnlineLive, setUserInfo })(
    Root
  )
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
