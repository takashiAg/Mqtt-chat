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
import mqtt from "mqtt"; // import namespace "mqtt"

const Form = styled(Container).attrs({ as: "form" })`
  flex-direction: row;
  position: sticky;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
  padding: 20px 0;
  gap: 20px;
  height: 100px;
`;
const TextInput = styled(Input).attrs({ as: "textarea" })`
  flex-basis: 100%;
  height: 100%;
  resize: none;
  margin: 0;
`;
const SubmitButton = styled(Button)`
  flex-basis: 100px;
  flex-shrink: 0;
  flex-grow: 0;
  margin: 0;
`;

interface MessageProps {
  mine?: boolean;
}
const Message = styled(Container)<MessageProps>`
  flex-direction: row;
  align-self: ${(props) => (props.mine ? "flex-end" : "flex-start")};
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
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

  // let client;
  useEffect(() => {
    const topic = `room/${roomId}`;

    // TODO: ハードコーディングしちゃったけど、ここは環境変数とかで設定できるようにしたい
    const client = mqtt.connectAsync("mqtt://localhost:15675", {});
    client.then((client) => {
      client.subscribe(topic, function (err) {
        if (!err) {
          client.publish(topic, "Hello mqtt");
        }
      });

      client.on("message", async function (topic, message) {
        // message is Buffer
        const messageText = message.toString();
        console.log({ messageText });
        if (topic !== `room/${roomId}`) return;
        await messages.execute({ roomId });
        const element = document.documentElement;
        const bottom = element.scrollHeight - element.clientHeight;
        window.scroll(0, bottom);
        // client.end();
      });
    });
    return () => {};
  }, [roomId]);
  return (
    <Container>
      <Header>{room.name}</Header>
      {messages?.data?.map?.((message) => (
        <Message mine={message?.mine || false}>{message.message}</Message>
      ))}
      <Form onSubmit={handleSubmit}>
        <TextInput name="message" />
        <SubmitButton>送信</SubmitButton>
      </Form>
    </Container>
  );
};

export default Room;
