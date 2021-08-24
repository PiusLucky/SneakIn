import styled from "styled-components";

const BlackRock =  styled.div`
  background: ${props => props.theme.bg_colors.blackRockTheme}!important;
  color: ${props => props.theme.text_colors.main}!important;
  transition: background 250ms ease-in, color 200ms ease-in;

  ${props => {
    if (props.leftSider) {
      return `
        margin-right: 1.5rem;
        color: ${props.theme.authTab.color};
      `;
    }
  }}

  &:hover {
      background: ${props => props.theme.bg_colors.blackRockTheme};
  }

`;


export const BlackRockV2 = styled(BlackRock)`
  border-bottom: 1px solid ${(props) => props.theme.channelFuncTab.borderStyle}!important;
`

export const BlackRockV3 = styled(BlackRock)`
  border-top: 1px solid ${(props) => props.theme.channelFuncTab.borderStyle}!important;
`

export default BlackRock