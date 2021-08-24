import styled from "styled-components";

export default styled.div`
  background: ${props => props.theme.bg_colors.blackRockTheme};
  color: ${props => props.theme.starTab.color};
  transition: background 250ms ease-in, color 200ms ease-in;

  &:hover {
      background: ${props => props.theme.bg_colors.blackRockTheme};
  }
`;