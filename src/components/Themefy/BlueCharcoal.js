import styled from "styled-components";

const BlueCharcoal = styled.div`
  background: ${props => props.theme.bg_colors.blueCharcoalTheme}!important;
  color: ${props => props.theme.text_colors.main};
`;


export const BlueCharcoalExtended = styled(BlueCharcoal)`
  background: inherit!important;
`;

export default BlueCharcoal;