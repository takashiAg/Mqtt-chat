// react 部屋一覧ページ

import Container from "../components/container";
import Header from "../components/header";
import LinkedButton from "../components/button-linked";

const NotFound = () => {
  return (
    <Container>
      <Header>not found</Header>
      <LinkedButton to="/">トップへ</LinkedButton>
    </Container>
  );
};

export default NotFound;
