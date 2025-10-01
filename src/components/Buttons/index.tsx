import styled from "styled-components";

interface Props {
  text: string;
  color: string;
}

export function Button(props: Props) {
  return <ButtonCastom color={props.color}>{props.text}</ButtonCastom>;
}

const ButtonCastom = styled.button<{color: string}>`
  width: 100px;
  height: 50px;
  background-color: ${(p) => p.color};
  border: none;
  cursor: pointer;
  transition: all 0.1s ease;
  
  &:active {
    background-color: #333333;
    transform: scale(0.98);
  }
  
  &:hover {
    opacity: 0.9;
  }
`;