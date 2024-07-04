// react 部屋一覧ページ

import Container from "../components/container";
import Input from "../components/input";
import Button from "../components/button";
import Header from "../components/header";
import styled from "styled-components";
import useSignup from "../api/signup";
import { useNavigate } from "react-router-dom";
import LinkedButton from "../components/button-linked";

const Form = styled(Container).attrs({ as: "form" })``;

const Signup = () => {
  const signup = useSignup();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget?.email?.value;
    const password = e.currentTarget?.password?.value;

    if (!email) return alert("メールアドレスを入力してください");
    if (!password) return alert("パスワードを入力してください");

    const result = await signup.execute({ email, password });

    if (result instanceof Error) return alert(result.message);

    navigate("/room");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header>登録</Header>
      <Input name="email" type="email" />
      <Input name="password" type="password" />
      <Button>登録</Button>
      <LinkedButton to="/signin">サインイン</LinkedButton>
    </Form>
  );
};

export default Signup;
