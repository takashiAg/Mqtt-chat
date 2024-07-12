// react 部屋一覧ページ

import Container from "../components/container";
import styled from "styled-components";
import Header from "../components/header";
import Input from "../components/input";
import Button from "../components/button";
import useUser from "../api/user";
import useUpdateUser from "../api/user-edit";
import { useEffect, useRef } from "react";

const Form = styled(Container).attrs({ as: "form" })`
  flex-direction: column;
`;
const TextInput = styled(Input)``;
const SubmitButton = styled(Button)``;

// interface MessageProps {
//   mine?: boolean;
// }
// const UserEdit = styled(Container)<MessageProps>`
//   flex-direction: row;
//   justify-content: ${(props) => (props.mine ? "flex-end" : "flex-start")};
// `;

const UserEdit = () => {
  const user = useUser({ pathParams: { userId: "me" } });
  const updateUser = useUpdateUser();

  const usernameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = e.currentTarget?.username?.value;
    const result = await updateUser.execute({ name });

    if (result instanceof Error) return alert(result.message);
  };

  useEffect(() => {
    if (user.loading) return;
    if (user.error) return;
    if (!user.data) return;
    if (!usernameRef?.currentTarget) return;
    console.log(usernameRef.currentTarget);
    usernameRef.currentTarget.value = user.data.name;
  }, [user]);

  return (
    <Container>
      <Header>ユーザー編集</Header>

      <Form onSubmit={handleSubmit}>
        <TextInput name="username" ref={usernameRef} />
        <SubmitButton>送信</SubmitButton>
      </Form>
    </Container>
  );
};

export default UserEdit;
