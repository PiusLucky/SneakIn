import {
  manatee,
  blackRock,
  arsenic,
  blueCharcoal,
  white,
  turquoise,
  whiteSmoke,
  grey,
  inherit,
  turquoiseGradient,
  _turquoiseGradient,
  ghostWhite,
  turquoiseOpacity,
  lightHr,
  snow,
  whiteOpacity,
  turquoiseShadow,
  matterhorn,
  opacity_1,
  grey_bright
} from "../config/colors";


import { full } from "../config/opacity"

import { svgWhite } from "../config/svg"


export default {
  bg_colors: {
    sideBarBackground: blackRock,
    channelParentBackground: blueCharcoal,
    arsenicTheme: arsenic,
    manateeTheme: manatee,
    blueCharcoalTheme: blueCharcoal,
    blackRockTheme: blackRock,
    borderRight: lightHr
  },
  
  text_colors: {
    main: manatee,
    secondary: white,
  },
  addButtonColor: {
    color: turquoise,
    borderColor: turquoise,
  },

  subscribeButtonColor: {
    color: turquoise,
    borderColor: turquoise,
  },

  sideBarIcons: {
    color: turquoise,
    background: arsenic,
  },

  pinColor: {
    color: turquoise,
  },

  themeToggleColor: {
    color: turquoise,
  },

  userTabHeader: {
    color: white,
  },

  userTabButton: {
    background: whiteSmoke,
    color: blackRock,
    svg: grey,
  },

  userTabCard: {
    background: inherit,
  },

  userTabInfo: {
    color: whiteSmoke,
  },

  userTabLM: {
    color: whiteSmoke,
  },

  starTabButton: {
    webkit: _turquoiseGradient,
    init_background: blackRock,
    background: turquoiseGradient,
  },

  starTab: {
    background: blueCharcoal,
    color: whiteSmoke,
  },

  profileTab: {
    color: turquoise,
  },

  channelFuncTab: {
    upper_text: whiteSmoke,
    lower_text: white,
    emojiBtn: turquoise,
    emojiBtnIcon: ghostWhite,
    sendBtn: turquoise,
    uploadBg: inherit,
    uploadBtn: turquoiseOpacity,
    borderStyle: lightHr,
    inputColor: white,
    QmBgImg: svgWhite,
    searchInputBg: inherit,
    searchInputColor: white,
    timeColor: matterhorn,
    emptyMessageIcon: grey,
    timeColorV2: grey_bright
  },

  groupInfoTab: {
    color: snow
  },

  noChannelTab: {
    color: whiteOpacity,
    background: blackRock,
    boxShadow: turquoiseShadow
  },

  authTab: {
    color: white,
    opacity: opacity_1
  },

  footerSection: {
    color: white,
    opacity: full,
    background: blackRock
  }
};
