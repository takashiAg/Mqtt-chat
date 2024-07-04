// react 部屋一覧ページ

import Container from "../components/container";
import Input from "../components/input";
import Button from "../components/button";
import Header from "../components/header";
import styled from "styled-components";
import useCreateroom from "../api/room-new";
import { useNavigate } from "react-router-dom";

const Form = styled(Container).attrs({ as: "form" })``;

const RoomCreate = () => {
  const createRoom = useCreateroom();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = e.currentTarget?.roomname?.value;
    if (!name) return alert("部屋名を入力してください");
    const result = await createRoom.execute({ name });

    if (result instanceof Error) return alert(result.message);

    navigate(`/room/${result.roomId}`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header>部屋作成</Header>
      <Input name="roomname" />
      <Button>作成</Button>
    </Form>
  );
};

export default RoomCreate;
