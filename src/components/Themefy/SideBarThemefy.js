import styled from "styled-components";

export default styled.div`
  background: ${props => props.theme.bg_colors.sideBarBackground};
  color: ${props => props.theme.text_colors.main};
  border-right: 1.5px solid ${props => props.theme.bg_colors.borderRight};
  transition: background 250ms ease-in, color 200ms ease-in;
`;