// react 部屋一覧ページ

import { Link } from "react-router-dom";
import Container from "../components/container";
import styled from "styled-components";
import Header from "../components/header";
import useRooms from "../api/rooms";

const Room = styled(Container).attrs({ as: Link })`
  flex-direction: row;
`;

const Rooms = () => {
  const rooms = useRooms();

  return (
    <Container>
      <Header>部屋一覧</Header>
      <Link to="/room/create">部屋を作成</Link>
      {rooms?.data?.map?.((room) => (
        <Room to={`/room/${room.id}`}>{room.name}</Room>
      ))}
    </Container>
  );
};

export default Rooms;
