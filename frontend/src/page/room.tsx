// react 部屋一覧ページ

import Container from "../components/container";
import styled from "styled-components";
import Header from "../components/header";
import useMessages from "../api/messages";
import usePostMessage from "../api/message-new";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Input from "../components/input";
import Button from "../components/button";

const Form = styled(Container).attrs({ as: "form" })`
  flex-direction: row;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
  padding: 20px;
  gap: 20px;
  height: 100px;
`;
const TextInput = styled(Input).attrs({ as: "textarea", rows: 3 })`
  flex-basis: 100%;
  resize: none;
`;
const SubmitButton = styled(Button)`
  flex-basis: 100px;
  flex-shrink: 0;
  flex-grow: 0;
`;

interface MessageProps {
  mine?: boolean;
}
const Message = styled(Container)<MessageProps>`
  flex-direction: row;
  justify-content: ${(props) => (props.mine ? "flex-end" : "flex-start")};
`;

const Room = () => {
  const { roomId = "" } = useParams<{ roomId: string }>();
  const postMessage = usePostMessage();
  const room = { id: 1, name: "部屋1" };
  const messages = useMessages({ params: { roomId } });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = e.currentTarget?.message?.value;
    if (!message) return alert("メッセージを入力してください");
    await postMessage.execute({ message, roomId });
  };

  useEffect(() => {
    messages.execute({ roomId });
  }, [roomId]);
  return (
    <Container>
      <Header>{room.name}</Header>
      {messages?.data?.map?.((message) => (
        <Message>{message.message}</Message>
      ))}
      <Form onSubmit={handleSubmit}>
        <TextInput name="message" />
        <SubmitButton>送信</SubmitButton>
      </Form>
    </Container>
  );
};

export default Room;
