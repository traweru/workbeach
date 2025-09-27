import styled from "styled-components";
interface Props {
  text: string;
  color:string;
}

export function Button(props: Props) {
  return <ButtonCastom color={props.color}>{props.text}</ButtonCastom>;
}
const ButtonCastom = styled.button<{color:string}>`
  width: 100px;
  height: 50px;
  background-color: ${(p)=> p.color};
`;
