import styled from "styled-components";

// Just for starting out, we can include a .div here
// It sure doesn't matter as we can override it by using the
// "as" polymorphic prop to dynamically swap out the element that receives the styles you wrote
export const Turquoise = styled.div`
  background: ${(props) => props.theme.addButtonColor.color}!important;
  border: 1px solid
    ${(props) => props.theme.addButtonColor.borderColor}!important;
`;

export const SubButton = styled.div`
  background: ${(props) => props.theme.subscribeButtonColor.color}!important;
  border: 1px solid
    ${(props) => props.theme.subscribeButtonColor.borderColor}!important;
`;

export const SideBarIcon = styled.span`
  background-color: ${(props) => props.theme.sideBarIcons.background};
  color: ${(props) => props.theme.sideBarIcons.color};
`;

export const PinColor = styled.span`
  color: ${(props) => props.theme.pinColor.color}!important;
`;

export const ThemeToggleButton = styled.div`
  &::before {
     background:  ${(props) => props.theme.themeToggleColor.color}!important;
  }:
`;

export const HeaderColor = styled.div`
  color: ${(props) => props.theme.userTabHeader.color}!important;
`;

export const ButtonColor = styled.button`
  background: ${(props) => props.theme.userTabButton.background}!important;
  svg {
    color: ${(props) => props.theme.userTabButton.svg}!important;
  }
  span {
    color: ${(props) => props.theme.userTabButton.color}!important;
  }
`;

export const CardColor = styled.div`
  background: ${(props) => props.theme.userTabCard.background}!important;
`;

export const UserInfo = styled.div`
  p {
    color: ${(props) => props.theme.userTabInfo.color}!important;
  }
`;

export const UserLastMsg = styled.p`
  color: ${(props) => props.theme.userTabLM.color}!important;
`;

export const StarActivateButton = styled.button`
  webkit: ${(props) => props.theme.starTabButton.init_background}!important;
  background: ${(props) => props.theme.starTabButton.init_background}!important;
  background: ${(props) => props.theme.starTabButton.background}!important;
`;

export const StarParentBackground = styled.div`
  background: ${(props) => props.theme.starTab.background}!important;
  color: ${(props) => props.theme.starTab.color};
`;

export const ProfileContent = styled.div`
  color: ${(props) => props.theme.profileTab.color}!important;
`;

export const UpperTextChat = styled.div`
  color: ${(props) => props.theme.channelFuncTab.upper_text}!important;
`;

export const LowerTextChat = styled.div`
  color: ${(props) => props.theme.channelFuncTab.lower_text}!important;
`;

export const EmojiButton = styled.button`
  background: ${(props) => props.theme.channelFuncTab.emojiBtn}!important;
  color: ${(props) => props.theme.channelFuncTab.emojiBtnIcon}!important;
`;

export const SendButton = styled.button`
  background: ${(props) => props.theme.channelFuncTab.sendBtn}!important;
`;

export const UploaderBackground = styled.div`
  background: ${(props) => props.theme.channelFuncTab.uploadBg}!important;
`;

export const UploaderBtnBackground = styled.div`
  background: ${(props) => props.theme.channelFuncTab.uploadBtn}!important;
`;

export const BorderStyle = styled.hr`
  border-color: ${(props) => props.theme.channelFuncTab.borderStyle}!important;
`;

export const QueryMessages = styled.div`
  border-left: 1.5px solid
    ${(props) => props.theme.channelFuncTab.borderStyle}!important;
  border-right: 1.5px solid
    ${(props) => props.theme.channelFuncTab.borderStyle}!important;
  margin-right: 0.3rem;

  ${(props) => {
    if (props.setBackground === "true") {
      return `
        background-color: transparent;
        background-image: ${props.theme.channelFuncTab.QmBgImg};
      `;
    }
  }}
`;

export const InputChannelFunc = styled.input`
  color: ${(props) => props.theme.channelFuncTab.inputColor}!important;
  background: inherit !important;
  border-bottom: 1px solid
    ${(props) => props.theme.channelFuncTab.borderStyle}!important;
`;

export const SearchInput = styled.input`
  color: ${(props) => props.theme.channelFuncTab.searchInputColor}!important;
  background: ${(props) => props.theme.channelFuncTab.searchInputBg}!important;
`;

export const TimeColor = styled.div`
  color: ${(props) => props.theme.channelFuncTab.timeColor};
`;

export const TimeColorV2 = styled.div`
  color: ${(props) => props.theme.channelFuncTab.timeColorV2};
`;

export const EmptyMesssageIcon = styled.svg`
  color: ${(props) => props.theme.channelFuncTab.emptyMessageIcon}!important;
`;

export const GoogleAuthColor = styled.div`
  div
    > #firebaseui_container
    > div
    > div.firebaseui-card-content
    > form
    > ul
    > li
    > button
    > span.firebaseui-idp-text.firebaseui-idp-text-long {
    opacity: ${(props) => props.theme.authTab.opacity}!important;
  }
`;

export const Footer = styled.div`
  color: ${(props) => props.theme.footerSection.color}!important;
  opacity: ${(props) => props.theme.footerSection.opacity}!important;
  background: ${(props) => props.theme.footerSection.background}!important;
`;
