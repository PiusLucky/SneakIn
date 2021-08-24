import styled from "styled-components";

export default styled.div`
  background: ${props => props.theme.bg_colors.channelParentBackground};
  color: ${props => props.theme.text_colors.main};
  transition: background 250ms ease-in-out, color 200ms ease-in;
`;