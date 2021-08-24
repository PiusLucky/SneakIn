import styled from "styled-components";

export const Manetee =  styled.p`
  color: ${props => props.theme.text_colors.main};

  ${props => {
    if (props.emptyImageIcon) {
      return `
        color: ${props.theme.groupInfoTab.color}!important;
      `;
    }
  }}

  ${props => {
    if (props.heroDiv) {
      return `
        color: ${props.theme.noChannelTab.color}!important;
        background: ${props.theme.noChannelTab.background}!important;
        box-shadow: ${props.theme.noChannelTab.boxShadow}!important;
      `;
    }
  }}

`;

export const ManeteeSpan =  styled.span`
  color: ${props => props.theme.text_colors.secondary}!important;
`;


