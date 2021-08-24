import {
  blackRock,
  white,
  red,
  gainsboro,
  black,
  blackOpacity,
  zircon,
  slightGrey,
  catalinaBlue,
  whiteSmoke,
  redGradient,
  _redGradient,
  ghostWhite,
  grey,
  spec_grey,
  denim,
  emojiLight,
  none,
  mediumSlateBlue,
  darkHr,
  whiteBorderRight,
  fireBrick,
  redShadow,
  inherit,
  lightSkyBlue,
  opacity_1
} from "../config/colors";

import { partial } from "../config/opacity"

import { svgColored } from "../config/svg"

const lightMode = {
  bg_colors: {
    sideBarBackground: white,
    channelParentBackground: white,
    arsenicTheme: white,
    manateeTheme: white,
    blueCharcoalTheme: white,
    blackRockTheme: white,
    borderRight: whiteBorderRight
  },

  text_colors: {
    main: white,
    secondary: black,
  },

  addButtonColor: {
    color: white,
    borderColor: gainsboro,
  },

  subscribeButtonColor: {
    color: red,
    borderColor: red,
  },

  sideBarIcons: {
    color: blackOpacity,
    background: zircon,
  },

  pinColor: {
    color: slightGrey,
  },

  themeToggleColor: {
    color: none,
  },

  userTabHeader: {
    color: catalinaBlue,
  },

  userTabButton: {
    background: blackRock,
    color: white,
    svg: whiteSmoke,
  },

  userTabCard: {
    background: white,
  },

  userTabInfo: {
    color: black,
  },

  userTabLM: {
    color: black,
  },

  starTabButton: {
    webkit: _redGradient,
    init_background: blackRock,
    background: redGradient,
  },

  starTab: {
    background: ghostWhite,
    color: black,
  },

  profileTab: {
    color: grey,
  },

  channelFuncTab: {
    upper_text: black,
    lower_text: spec_grey,
    emojiBtn: emojiLight,
    emojiBtnIcon: denim,
    sendBtn: denim,
    uploadBg: white,
    uploadBtn: mediumSlateBlue,
    borderStyle: darkHr,
    inputColor: black,
    QmBgImg: svgColored,
    searchInputBg: inherit,
    searchInputColor: grey,
    timeColor: lightSkyBlue,
    emptyMessageIcon: denim,
    timeColorV2: grey
  },

  groupInfoTab: {
    color: fireBrick
  },

  noChannelTab: {
    color: blackOpacity,
    background: white,
    boxShadow: redShadow,

  },

  authTab: {
    color: black,
    opacity: opacity_1
  },

  footerSection: {
    color:  blackRock,
    opacity: partial,
    background: white
  }
};



export default lightMode;