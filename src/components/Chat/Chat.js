import React, { Component } from "react";
// import Status from './Status'
import Channel from "./Channel";
import ChannelDuplicate from "./ChannelDuplicate";
// import ChannelChat from './ChannelChat'

// import Loader from './Loader'

import "../../static/css/chat.css";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "styled-components";
import lightTheme from "../../themes/light";
import darkTheme from "../../themes/dark";
import { connect } from "react-redux";
import { setCurrentTheme } from "../../actions";
import { useMediaQuery } from "react-responsive";

class Chat extends Component {
  state = {
    main_key: Math.random(),
    theme: "dark",
  };

  componentDidMount = () => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      this.setState(
        {
          theme: localTheme,
        },
        () => this.props.setCurrentTheme(localTheme)
      );
      this.props.setCurrentTheme(localTheme);
    }
  };

  updateChannelComp = () => {
    this.setState({
      main_key: Math.random(),
    });
  };

  setMode = (mode) => {
    localStorage.setItem("theme", mode);
    this.setState(
      {
        theme: mode,
      },
      () => this.props.setCurrentTheme(mode)
    );
    this.props.setCurrentTheme(mode);
  };

  themeToggler = () => {
    const { theme } = this.state;
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
      this.setMode("light");
    }
    theme === "dark" ? this.setMode("light") : this.setMode("dark");
  };

  themeMode = () => {
    return this.props.isDesktop
      ? this.state.theme === "light"
        ? lightTheme
        : darkTheme
      : lightTheme;
  };

  render() {
    const { isDesktop } = this.props
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Chat | SneakIn.app</title>
          <link
            rel="canonical"
            href="http://sneaker-chat-app.vercel.app/chat"
          />
        </Helmet>
        <ThemeProvider
          theme={this.themeMode()}
          themeToggler={this.themeToggler}
        >
        {!isDesktop?
          <Channel
            key={this.state.main_key}
            all_users_ids={this.props.all_users_ids}
            updateChannelComp={this.updateChannelComp}
            themeToggler={this.themeToggler}
          />
          :
          <ChannelDuplicate
           key={this.state.main_key}
           all_users_ids={this.props.all_users_ids}
           updateChannelComp={this.updateChannelComp}
           themeToggler={this.themeToggler}
          />
        }

        </ThemeProvider>
      </>
    );
  }
}

const ChatFunc = (props) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1201px)",
  });

  return (
    <Chat
      setCurrentTheme={props.setCurrentTheme}
      isDesktop={isDesktopOrLaptop}
    />
  );
};

export default connect(null, { setCurrentTheme })(ChatFunc);
